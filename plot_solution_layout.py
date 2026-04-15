from __future__ import annotations

import argparse
import sys
from pathlib import Path

import networkx as nx

PROJECT_ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = PROJECT_ROOT / "src"
if str(SRC_DIR) in sys.path:
    sys.path.remove(str(SRC_DIR))
sys.path.insert(0, str(SRC_DIR))

from optimizer.graph import build_routing_closure, load_graph
from tessera_schema import Batch, OptimizerPlanResponse, OptimizerSolution


def _build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Render a layout graph with all routes for a selected optimizer solution",
    )
    parser.add_argument("response_json", type=Path, help="Path to optimizer response JSON")
    parser.add_argument(
        "--solution",
        type=str,
        required=True,
        help="Solution selector (matches solution_id or tradeoff_label)",
    )
    parser.add_argument(
        "--output",
        type=Path,
        required=True,
        help="Output PNG file path",
    )
    parser.add_argument(
        "--batch-id",
        type=str,
        default=None,
        help="Optional batch_id filter (default: plot all batches)",
    )
    return parser


def _read_response(path: Path) -> OptimizerPlanResponse:
    return OptimizerPlanResponse.model_validate_json(path.read_text(encoding="utf-8"))


def _select_solution(response: OptimizerPlanResponse, selector: str) -> OptimizerSolution:
    matches = [
        item
        for item in response.solutions
        if item.solution_id == selector or item.tradeoff_label == selector
    ]
    if not matches:
        choices = ", ".join(
            f"{item.solution_id} ({item.tradeoff_label})" for item in response.solutions
        )
        raise ValueError(
            f"solution '{selector}' not found. Available: {choices if choices else '(none)'}"
        )
    if len(matches) > 1:
        choices = ", ".join(f"{item.solution_id} ({item.tradeoff_label})" for item in matches)
        raise ValueError(f"solution selector '{selector}' is ambiguous. Matches: {choices}")
    return matches[0]


def _filter_batches(solution: OptimizerSolution, batch_id: str | None) -> list[Batch]:
    if batch_id is None:
        return list(solution.batches)
    matches = [item for item in solution.batches if item.batch_id == batch_id]
    if not matches:
        choices = ", ".join(item.batch_id for item in solution.batches)
        raise ValueError(f"batch_id '{batch_id}' not found. Available: {choices}")
    return matches


def _build_positions(graph: nx.DiGraph) -> dict[str, tuple[float, float]]:
    pos: dict[str, tuple[float, float]] = {}
    for node_id, attrs in graph.nodes(data=True):
        x = attrs.get("x")
        y = attrs.get("y")
        if x is None or y is None:
            return {
                str(key): (float(value[0]), float(value[1]))
                for key, value in nx.planar_layout(graph.to_undirected()).items()
            }
        pos[str(node_id)] = (float(x), float(y))
    return pos


def _stitch_batch_path(
    *,
    closure_paths: dict[tuple[str, str], tuple[str, ...]],
    start_node_id: str,
    end_node_id: str,
    stop_location_ids: list[str],
) -> list[str]:
    ordered_nodes = [start_node_id, *stop_location_ids, end_node_id]
    stitched: list[str] = []
    for index in range(1, len(ordered_nodes)):
        source = ordered_nodes[index - 1]
        target = ordered_nodes[index]
        segment = closure_paths.get((source, target))
        if segment is None:
            raise ValueError(f"no shortest path from {source} to {target}")
        if stitched:
            stitched.extend(segment[1:])
        else:
            stitched.extend(segment)
    return stitched


def _plot_solution(
    *,
    graph: nx.DiGraph,
    solution: OptimizerSolution,
    batches: list[Batch],
    output_path: Path,
) -> None:
    try:
        import matplotlib.pyplot as plt
        from matplotlib.lines import Line2D
    except ImportError as exc:
        raise RuntimeError("matplotlib is required. Install it in your environment and retry.") from exc

    pos = _build_positions(graph)
    undirected_graph = graph.to_undirected()

    node_type_colors = {
        "pick": "#c26d00",
        "staging": "#005f73",
        "aisle_waypoint": "#0a9396",
        "aisle_end": "#94d2bd",
        "cross_aisle": "#3d405b",
    }
    default_node_color = "#8d99ae"
    node_colors = [
        node_type_colors.get(str(attrs.get("node_type") or ""), default_node_color)
        for _, attrs in graph.nodes(data=True)
    ]

    task_location_ids = [
        stop.location_id
        for batch in batches
        for stop in batch.sequence
        if stop.location_id is not None
    ]
    start_node_ids = [batch.route.start_node_id for batch in batches if batch.route.start_node_id is not None]
    end_node_ids = [batch.route.end_node_id for batch in batches if batch.route.end_node_id is not None]
    closure = build_routing_closure(
        graph=graph,
        task_location_ids=task_location_ids,
        start_node_ids=start_node_ids,
        end_node_ids=end_node_ids,
    )

    cmap = plt.get_cmap("tab20")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    plt.figure(figsize=(16, 10), dpi=160)
    nx.draw_networkx_edges(undirected_graph, pos=pos, edge_color="#c7d3dd", width=0.35, alpha=0.6)
    nx.draw_networkx_nodes(
        undirected_graph,
        pos=pos,
        node_size=3,
        node_color=node_colors,
        linewidths=0.0,
        alpha=0.9,
    )

    batch_handles: list[Line2D] = []
    for index, batch in enumerate(batches):
        start_node_id = batch.route.start_node_id
        end_node_id = batch.route.end_node_id
        if start_node_id is None or end_node_id is None:
            continue
        stop_location_ids = [item.location_id for item in batch.sequence if item.location_id is not None]
        stitched_path = _stitch_batch_path(
            closure_paths=closure.paths,
            start_node_id=start_node_id,
            end_node_id=end_node_id,
            stop_location_ids=stop_location_ids,
        )
        edge_list = list(zip(stitched_path[:-1], stitched_path[1:]))
        color = cmap(index % 20)

        nx.draw_networkx_edges(
            graph,
            pos=pos,
            edgelist=edge_list,
            edge_color=[color],
            width=2.1,
            alpha=0.95,
            arrows=False,
        )

        stop_nodes = [node for node in stop_location_ids if node in graph]
        if stop_nodes:
            nx.draw_networkx_nodes(
                graph,
                pos=pos,
                nodelist=stop_nodes,
                node_size=24,
                node_color=[color],
                linewidths=0.5,
                edgecolors="#222222",
                alpha=0.95,
            )

        if start_node_id in graph:
            nx.draw_networkx_nodes(
                graph,
                pos=pos,
                nodelist=[start_node_id],
                node_size=70,
                node_color=[color],
                node_shape="^",
                linewidths=0.7,
                edgecolors="#111111",
            )
        if end_node_id in graph:
            nx.draw_networkx_nodes(
                graph,
                pos=pos,
                nodelist=[end_node_id],
                node_size=70,
                node_color=[color],
                node_shape="s",
                linewidths=0.7,
                edgecolors="#111111",
            )

        batch_handles.append(Line2D([0], [0], color=color, lw=2.4, label=batch.batch_id))

    node_type_handles = [
        Line2D(
            [0],
            [0],
            marker="o",
            linestyle="None",
            label=node_type,
            markerfacecolor=node_type_colors.get(node_type, default_node_color),
            markeredgecolor="none",
            markersize=7,
        )
        for node_type in sorted(
            {
                str(attrs.get("node_type"))
                for _, attrs in graph.nodes(data=True)
                if attrs.get("node_type") is not None
            }
        )
    ]

    marker_handles = [
        Line2D([0], [0], marker="^", linestyle="None", color="#555555", markersize=7, label="batch start"),
        Line2D([0], [0], marker="s", linestyle="None", color="#555555", markersize=7, label="batch end"),
        Line2D([0], [0], marker="o", linestyle="None", color="#555555", markersize=6, label="pick stop"),
    ]

    legend_handles = [*node_type_handles, *marker_handles, *batch_handles]
    if legend_handles:
        plt.legend(
            handles=legend_handles,
            title="Layout + Solution",
            loc="upper left",
            bbox_to_anchor=(1.01, 1.0),
            frameon=True,
            borderaxespad=0.0,
        )

    plt.title(
        f"Solution Overlay: {solution.solution_id} ({solution.tradeoff_label}) | batches={len(batches)}"
    )
    plt.axis("equal")
    plt.axis("off")
    plt.tight_layout(rect=(0, 0, 0.8, 1))
    plt.savefig(output_path, bbox_inches="tight")
    plt.close()


def main() -> None:
    args = _build_arg_parser().parse_args()
    response = _read_response(args.response_json)
    solution = _select_solution(response, args.solution)
    batches = _filter_batches(solution, args.batch_id)
    graph = load_graph(response.request_echo.layout_uri)

    if not batches:
        raise ValueError("selected solution has no batches to plot")

    _plot_solution(
        graph=graph,
        solution=solution,
        batches=batches,
        output_path=args.output,
    )
    print(f"Wrote solution plot: {args.output.resolve()}")


if __name__ == "__main__":
    main()
