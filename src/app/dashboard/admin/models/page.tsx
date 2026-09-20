"use client";

import { Card, StatusBadge, Table, Td } from "@/components/ui/cards";

const MODELS = [
  { name: "Llama 3 (70B)", version: "3.1", param: "70B", purpose: "Structural analysis, synthesis", status: "active", accuracy: 92, latency: "2.8s", gpu: "A100 80GB" },
  { name: "Mistral (7B)", version: "0.3", param: "7B", purpose: "Line editing, continuity checks", status: "active", accuracy: 88, latency: "0.8s", gpu: "RTX 4090" },
  { name: "Stable Diffusion XL", version: "1.0", param: "2.6B", purpose: "Cover art generation", status: "idle", accuracy: 85, latency: "4.5s", gpu: "A100 80GB" },
  { name: "Prophet", version: "1.1", param: "-", purpose: "Demand forecasting", status: "active", accuracy: 91, latency: "0.1s", gpu: "CPU" },
  { name: "LSTM (Custom)", version: "2.0", param: "5M", purpose: "Time-series stock prediction", status: "active", accuracy: 89, latency: "0.05s", gpu: "CPU" },
];

export default function ModelsPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-6">🤖 AI Model Management</h2>
      <Card>
        <Table headers={["Model", "Version", "Parameters", "Purpose", "Status", "Accuracy", "Latency", "GPU"]}>
          {MODELS.map((m) => (
            <tr key={m.name} className="table-row-hover">
              <Td className="font-medium text-slate-900">{m.name}</Td>
              <Td className="font-mono text-xs">{m.version}</Td>
              <Td className="font-mono text-xs">{m.param}</Td>
              <Td className="text-sm text-slate-500">{m.purpose}</Td>
              <Td><StatusBadge status={m.status} /></Td>
              <Td>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${m.accuracy}%` }} />
                  </div>
                  <span className="text-xs font-mono">{m.accuracy}%</span>
                </div>
              </Td>
              <Td className="font-mono">{m.latency}</Td>
              <Td className="text-xs">{m.gpu}</Td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}