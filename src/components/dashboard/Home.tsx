import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { abbreviateNumber } from "js-abbreviation-number";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import ToastFn from "../Toaster";
import axiosInstance from "@/api/axiosInstance";
import { ScrollArea } from "../ui/scroll-area";

const chartConfig: ChartConfig = {
  views: {
    label: "Total Views",
    color: "hsl(var(--chart-1))",
  },
};

interface AnalyticsItem {
  name: string;
  views: string; // percentage in string format
}

interface MonthlyAnalyticsItem {
  name: string;
  views: number;
}

const Home = () => {
  const [browser, setBrowser] = useState<AnalyticsItem[]>([]);
  const [os, setOs] = useState<AnalyticsItem[]>([]);
  const [monthAnalytics, setMonthAnalytics] = useState<MonthlyAnalyticsItem[]>(
    []
  );
  const [totalVistes, setTotalVistes] = useState<number>(0);

  useEffect(() => {
    const fetchAnaytics = async () => {
      try {
        const { data } = await axiosInstance.get("/v1/analytics/fetch");
        console.log(data);
        setTotalVistes(data.totalVisits || 0);
        setMonthAnalytics(data.monthAnalytics || []);
        setBrowser(data.browser || []);
        setOs(data.os || []);
      } catch (err) {
        ToastFn(
          "error",
          "Error",
          "something went wrong ,while fetching analytics"
        );
      }
    };
    fetchAnaytics();
  }, []);

  return (
    <div className="py-4 flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
        <Card className="bg-dark-bg-card border-[#44485e] overflow-hidden col-span-1 ">
          <CardHeader className="border-b border-[#44485e]">
            <CardTitle className="text-[#cfcde4] flex justify-between items-center">
              <span>Type</span>
              <span className="text-sm">Page views(in %)</span>
            </CardTitle>
          </CardHeader>
          <ScrollArea className="px-2 py-2 min-h-[182px] max-h-[182px] flex flex-col gap-2">
            <div>
              <p className="text-white/35 text-xs">Browser: </p>
              {browser.map((item) => {
                const percentage = parseInt(item?.views || "0");
                const backgroundStyle = {
                  background: `linear-gradient(to right, #44485e ${percentage}%, transparent 0%)`,
                };
                return (
                  <div
                    key={item.name}
                    className="px-3 py-1 flex justify-between items-center text-sm hover:!bg-[#44485e] rounded transition-colors duration-300 ease-in-out my-1"
                    style={backgroundStyle}
                  >
                    <p className="text-[#cfcde4]">{item.name}</p>
                    <p className="text-[#cfcde4]">{item.views}</p>
                  </div>
                );
              })}

              <p className="text-white/35 text-xs">Operating System: </p>
              {os.map((item) => {
                const percentage = parseInt(item?.views || "0");
                const backgroundStyle = {
                  background: `linear-gradient(to right, #44485e ${percentage}%, transparent 0%)`,
                };
                return (
                  <div
                    key={item.name}
                    className="px-3 py-1 flex justify-between items-center text-sm hover:!bg-[#44485e] rounded transition-colors duration-300 ease-in-out my-1"
                    style={backgroundStyle}
                  >
                    <p className="text-[#cfcde4]">{item.name}</p>
                    <p className="text-[#cfcde4]">{item.views}</p>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </Card>
        <Card className="bg-dark-bg-card border-[#44485e] overflow-hidden col-span-1 ">
          <CardHeader className="border-b border-[#44485e]">
            <CardTitle className="text-[#cfcde4] flex justify-between items-center">
              <span>Total Visits</span>
            </CardTitle>
          </CardHeader>
          <div className=" px-2 py-2 min-h-[182px] max-h-[182px] text-[#cfcde4] text-7xl font-semibold flex justify-center items-center gap-2">
            <TrendingUp size={70} className="mt-4" />
            <span>{abbreviateNumber(totalVistes, 2, { padding: false })}</span>
          </div>
        </Card>
      </div>
      <Card className="col-start-2 col-end-4 bg-dark-bg-card border-[#44485e]">
        <CardHeader className="text-[#cfcde4]">
          <CardTitle>Report</CardTitle>
          <CardDescription className="text-[#cfcde4]">
            Showing the data for the current year({new Date().getFullYear()})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-72 w-full">
            <AreaChart
              accessibilityLayer
              data={monthAnalytics}
              margin={{
                left: 12,
                right: 12,
              }}
              className="bg-dark-bg-card"
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area dataKey="views" type="natural" fillOpacity={0.4} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
