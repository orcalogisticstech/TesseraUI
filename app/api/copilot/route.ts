import { shouldUseMockData } from "@/lib/server/data-mode";
import { fetchRunDetailsRaw, queryTessCopilotRaw } from "@/lib/server/tesserapick-client";
import { normalizeRunDetails } from "@/lib/tesserapick-normalizers";
import { NextResponse } from "next/server";

type Attachment = {
  run?: {
    runId?: string;
    tradeoffLabel?: string;
  };
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { question?: string; attachments?: Attachment[] };
    const question = body.question?.trim();
    if (!question) {
      return NextResponse.json({ error: "question is required." }, { status: 400 });
    }

    if (shouldUseMockData()) {
      return NextResponse.json({
        answer: "I mapped that request to the active optimization model. In mock mode, run-specific grounding uses recorded heartbeat data.",
        success: true,
        selectedSkills: []
      });
    }

    const attachment = body.attachments?.find((item) => item.run?.runId && item.run?.tradeoffLabel);
    let optimizerRequest: Record<string, unknown> = { question_context: "No run attachment provided." };
    let optimizerResponse: Record<string, unknown> | undefined;

    if (attachment?.run?.runId && attachment.run.tradeoffLabel) {
      const rawDetails = await fetchRunDetailsRaw({
        runId: attachment.run.runId,
        tradeoffLabel: attachment.run.tradeoffLabel,
        page: 0,
        pageSize: 100
      });
      const details = normalizeRunDetails(rawDetails);
      optimizerRequest = {
        request_id: details.requestId,
        tenant_id: details.requestContext.tenantId,
        facility_id: details.requestContext.facilityId,
        workflow: details.workflow,
        mode: details.mode,
        job: {
          job_id: details.requestContext.jobId,
          created_ts: details.requestContext.requestTimestamp
        },
        job_config: {
          weights: {
            travel_time: details.requestContext.weights.travelTime,
            tardiness: details.requestContext.weights.tardiness,
            zone_balance: details.requestContext.weights.zoneBalance
          },
          penalties: {
            zone_cross: details.requestContext.penalties.zoneCross,
            split_order: details.requestContext.penalties.splitOrder,
            grouping_violation: details.requestContext.penalties.groupingViolation
          },
          max_batches: details.requestContext.limits.maxBatches,
          max_tasks_per_zone: details.requestContext.limits.maxTasksPerZone,
          available_carts: details.requestContext.availableCarts.map((cart) => ({
            cart_type_id: cart.cartTypeId,
            count: cart.count
          })),
          no_go_zones: details.requestContext.noGoZones,
          blocked_aisles: details.requestContext.blockedAisles,
          blocked_terminals: details.requestContext.blockedTerminals
        },
        pick_work_release: {
          tasks: Object.entries(details.taskDetails).map(([taskId, task]) => ({
            task_id: taskId,
            order_id: task.orderId,
            sku_id: task.skuId,
            quantity: task.quantity,
            sku_weight: task.skuWeight
          }))
        }
      };
      optimizerResponse = {
        response_id: details.responseId,
        request_id: details.requestId,
        status: details.status,
        timestamp: details.timestamp,
        computation_time: details.computationTime,
        solutions: [
          {
            solution_id: details.solutionId,
            tradeoff_label: details.tradeoffLabel,
            solution_metrics: details.solutionMetrics,
            batches: details.batches,
            unselected_tasks: details.unselectedTasks
          }
        ]
      };
    }

    const raw = (await queryTessCopilotRaw({
      question,
      optimizer_request: optimizerRequest,
      optimizer_response: optimizerResponse
    })) as { answer?: string; selected_skills?: string[]; success?: boolean; error_message?: string };

    return NextResponse.json({
      answer: raw.answer ?? raw.error_message ?? "TessCopilot did not return an answer.",
      success: raw.success ?? false,
      selectedSkills: raw.selected_skills ?? []
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to reach TessCopilot.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
