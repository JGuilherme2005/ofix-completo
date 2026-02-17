import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';

// Cores do design system Tailwind (evitar hardcoded hex)
const CHART_COLORS = {
    grid: 'hsl(var(--border, 214.3 31.8% 91.4%))',
    axisTick: 'hsl(var(--muted-foreground, 215.4 16.3% 46.9%))',
    cursorFill: 'hsl(var(--muted, 210 40% 96.1%))',
    entradas: '#22c55e', // green-500 — Recharts requer hex
    saidas: '#ef4444',   // red-500 — Recharts requer hex
    gridStroke: '#e2e8f0', // slate-200 — Recharts requer hex
    tickFill: '#64748b',   // slate-500 — Recharts requer hex
    tooltipCursor: '#f1f5f9', // slate-100 — Recharts requer hex
} as const;

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                <p className="font-semibold text-slate-700 dark:text-slate-200">{label}</p>
                <p className="text-sm text-green-600 dark:text-green-400">{`Entradas: R$ ${parseFloat(payload[0].value).toFixed(2)}`}</p>
                <p className="text-sm text-red-600 dark:text-red-400">{`Saídas: R$ ${parseFloat(payload[1].value).toFixed(2)}`}</p>
            </div>
        );
    }
    return null;
};

export default function FinanceiroChart({ transacoes }) {
    const chartData = useMemo(() => {
        const grouped = (transacoes || []).reduce((acc: Record<string, any>, t: any) => {
            const date = new Date(t.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            if (!acc[date]) {
                acc[date] = { date, entradas: 0, saidas: 0 };
            }
            if (t.tipo === 'Entrada') {
                acc[date].entradas += parseFloat(t.valor);
            } else {
                acc[date].saidas += parseFloat(t.valor);
            }
            return acc;
        }, {} as Record<string, any>);
        return (Object.values(grouped) as any[]).sort((a: any, b: any) => a.date.localeCompare(b.date));
    }, [transacoes]);

    return (
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.gridStroke} />
                    <XAxis dataKey="date" tick={{ fill: CHART_COLORS.tickFill, fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: CHART_COLORS.tickFill, fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value / 1000}k`} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: CHART_COLORS.tooltipCursor }} />
                    <Legend wrapperStyle={{ fontSize: "14px" }} />
                    <Bar dataKey="entradas" fill={CHART_COLORS.entradas} name="Entradas" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="saidas" fill={CHART_COLORS.saidas} name="Saídas" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
