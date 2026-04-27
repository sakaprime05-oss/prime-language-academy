"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#E7162A', '#21286E', '#4F46E5', '#10B981', '#F59E0B'];

export function StatsCharts({ data }: { data: any }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            {/* Revenue Chart */}
            <div className="glass-card p-6 bg-[#12121e] border-white/5">
                <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Revenus (XOF)
                </h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                itemStyle={{ color: '#E7162A', fontWeight: 'bold' }}
                            />
                            <Bar dataKey="total" fill="#E7162A" radius={[6, 6, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Student Growth Chart */}
            <div className="glass-card p-6 bg-[#12121e] border-white/5">
                <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Nouveaux Étudiants
                </h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.studentData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                itemStyle={{ color: '#4F46E5', fontWeight: 'bold' }}
                            />
                            <Line type="monotone" dataKey="count" stroke="#4F46E5" strokeWidth={4} dot={{ r: 6, fill: '#4F46E5' }} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Level Distribution */}
            <div className="glass-card p-6 bg-[#12121e] border-white/5 lg:col-span-2">
                <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Répartition par Niveau
                </h3>
                <div className="h-[300px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data.levelData}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={120}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.levelData.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="hidden sm:flex flex-col gap-3 mr-12">
                        {data.levelData.map((entry: any, index: number) => (
                            <div key={entry.name} className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                <span className="text-xs font-bold text-white/60 uppercase tracking-widest">{entry.name}</span>
                                <span className="text-xs font-black text-white">{entry.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
