import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function TrendsView({ timeSeriesData, loading, error }) {
  const [activeMetric, setActiveMetric] = useState("cases");

  // Handle the case when data is loading
  if (loading) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading incidence data...</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-full">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Handle no data
  if (!timeSeriesData || timeSeriesData.length === 0) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-full">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
          <p className="font-bold">No Data Available</p>
          <p>No incidence rate data is currently available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Dengue Incidence Trends</h2>
        <div className="flex gap-2">
          <button
            className={`px-2 py-1 text-xs font-medium rounded ${
              activeMetric === "cases"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setActiveMetric("cases")}
          >
            Cases
          </button>
          <button
            className={`px-2 py-1 text-xs font-medium rounded ${
              activeMetric === "incidenceRate"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setActiveMetric("incidenceRate")}
          >
            Incidence Rate
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            {activeMetric === "cases" && (
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="#2563EB"
                domain={[0, "auto"]}
                tickFormatter={(value) => value.toLocaleString()}
              />
            )}
            {activeMetric === "incidenceRate" && (
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#6B7280"
                domain={[0, "auto"]}
                tickFormatter={(value) => value.toFixed(2)}
              />
            )}
            <Tooltip
              formatter={(value, name) => {
                if (name === "Cases") return value.toLocaleString();
                if (name === "Incidence Rate") return value.toFixed(2);
                return value;
              }}
            />
            <Legend />
            {activeMetric === "cases" && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="cases"
                stroke="#2563EB"
                activeDot={{ r: 8 }}
                name="Cases"
                strokeWidth={2}
              />
            )}
            {activeMetric === "incidenceRate" && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="incidenceRate"
                stroke="#6B7280"
                name="Incidence Rate"
                strokeWidth={2}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
