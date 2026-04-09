from __future__ import annotations

import argparse
import json
import math
import pickle
from pathlib import Path

import networkx as nx
import pyarrow.parquet as pq


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Export a frontend-friendly layout render artifact")
    parser.add_argument("layout_dir", type=Path, help="Directory containing graph.pkl and layout_metadata.json")
    parser.add_argument(
        "--output",
        type=Path,
        default=None,
        help="Optional output path (default: <layout_dir>/layout.render.json)",
    )
    return parser.parse_args()


def load_graph(graph_path: Path) -> nx.DiGraph:
    if not graph_path.exists():
        raise ValueError(f"layout graph not found: {graph_path}")

    with graph_path.open("rb") as file_obj:
        graph = pickle.load(file_obj)

    if not isinstance(graph, nx.DiGraph):
        raise ValueError(f"layout graph must be networkx.DiGraph, got: {type(graph).__name__}")
    return graph


def load_json(json_path: Path) -> dict:
    if not json_path.exists():
        raise ValueError(f"metadata file not found: {json_path}")
    return json.loads(json_path.read_text(encoding="utf-8"))


def load_parquet_counts(parquet_path: Path, node_type_column: str | None = None) -> tuple[int, dict[str, int]]:
    parquet_file = pq.ParquetFile(parquet_path)
    counts: dict[str, int] = {}
    if node_type_column:
        values = pq.read_table(parquet_path, columns=[node_type_column]).column(node_type_column).to_pylist()
        for value in values:
            key = str(value) if value is not None else "unknown"
            counts[key] = counts.get(key, 0) + 1
    return parquet_file.metadata.num_rows, counts


def to_finite_float(value: object) -> float | None:
    if isinstance(value, (int, float)) and math.isfinite(value):
        return float(value)
    return None


def build_render_artifact(layout_dir: Path) -> dict:
    metadata = load_json(layout_dir / "layout_metadata.json")
    graph = load_graph(layout_dir / "graph.pkl")

    nodes = []
    node_type_counts: dict[str, int] = {}
    min_x = float("inf")
    max_x = float("-inf")
    min_y = float("inf")
    max_y = float("-inf")

    for node_id, attrs in graph.nodes(data=True):
        x = to_finite_float(attrs.get("x"))
        y = to_finite_float(attrs.get("y"))
        z = to_finite_float(attrs.get("z"))
        if x is None or y is None:
            continue

        node_type = str(attrs.get("node_type") or "unknown")
        node = {
            "id": str(node_id),
            "type": node_type,
            "zoneId": str(attrs.get("zone_id")) if attrs.get("zone_id") is not None else None,
            "aisle": str(attrs.get("aisle")) if attrs.get("aisle") is not None else None,
            "bay": to_finite_float(attrs.get("bay")),
            "side": str(attrs.get("side")) if attrs.get("side") is not None else None,
            "level": to_finite_float(attrs.get("level")),
            "position": to_finite_float(attrs.get("position")),
            "locationType": str(attrs.get("location_type")) if attrs.get("location_type") is not None else None,
            "sourceLocationId": str(attrs.get("source_location_id")) if attrs.get("source_location_id") is not None else None,
            "x": x,
            "y": y,
            "z": z,
        }
        nodes.append(node)
        node_type_counts[node_type] = node_type_counts.get(node_type, 0) + 1
        min_x = min(min_x, node["x"])
        max_x = max(max_x, node["x"])
        min_y = min(min_y, node["y"])
        max_y = max(max_y, node["y"])

    if not nodes:
        raise ValueError("layout graph contains no renderable nodes")

    known_node_ids = {node["id"] for node in nodes}
    edges = []
    for source, target in graph.edges():
        source_id = str(source)
        target_id = str(target)
        if source_id in known_node_ids and target_id in known_node_ids:
            edges.append({"source": source_id, "target": target_id})

    nodes_parquet_path = layout_dir / "nodes.parquet"
    edges_parquet_path = layout_dir / "edges.parquet"
    if nodes_parquet_path.exists():
        parquet_node_count, parquet_node_type_counts = load_parquet_counts(nodes_parquet_path, "node_type")
        if parquet_node_count != len(nodes):
            raise ValueError(f"nodes.parquet row count {parquet_node_count} does not match graph node count {len(nodes)}")
        if parquet_node_type_counts != node_type_counts:
            raise ValueError("nodes.parquet node_type counts do not match graph node_type counts")

    if edges_parquet_path.exists():
        parquet_edge_count, _ = load_parquet_counts(edges_parquet_path)
        if parquet_edge_count != len(edges):
            raise ValueError(f"edges.parquet row count {parquet_edge_count} does not match graph edge count {len(edges)}")

    metadata_node_count = metadata.get("node_count")
    metadata_edge_count = metadata.get("edge_count")
    if metadata_node_count is not None and int(metadata_node_count) != len(nodes):
        raise ValueError(f"metadata node_count {metadata_node_count} does not match graph node count {len(nodes)}")
    if metadata_edge_count is not None and int(metadata_edge_count) != len(edges):
        raise ValueError(f"metadata edge_count {metadata_edge_count} does not match graph edge count {len(edges)}")

    return {
        "metadata": metadata,
        "bounds": {
            "minX": min_x,
            "maxX": max_x,
            "minY": min_y,
            "maxY": max_y,
        },
        "nodeTypeCounts": node_type_counts,
        "nodes": nodes,
        "edges": edges,
    }


def main() -> None:
    args = parse_args()
    layout_dir = args.layout_dir.resolve()
    output_path = args.output.resolve() if args.output else layout_dir / "layout.render.json"

    artifact = build_render_artifact(layout_dir)
    output_path.write_text(json.dumps(artifact, indent=2, allow_nan=False), encoding="utf-8")
    print(f"Wrote layout render artifact: {output_path}")


if __name__ == "__main__":
    main()
