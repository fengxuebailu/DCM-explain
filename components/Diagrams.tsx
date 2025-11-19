
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Network, Database, Scissors, Search } from 'lucide-react';

// --- CLUSTER FORMATION DIAGRAM ---
export const ClusterFormationDiagram: React.FC = () => {
  const [points, setPoints] = useState<{id: number, x: number, y: number, cluster: number}[]>([]);
  const [clusters, setClusters] = useState<{id: number, x: number, y: number, color: string}[]>([]);
  const [time, setTime] = useState(0);

  const colors = ['bg-blue-500', 'bg-red-500', 'bg-emerald-500', 'bg-amber-500'];

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Simulate data stream
    const tMod = time % 12;
    
    // Phase 1: Cluster 0 forming (0-3s)
    if (tMod < 3) {
       if(tMod === 0 && clusters.length === 0) setClusters([{id: 0, x: 30, y: 30, color: colors[0]}]);
       addPoint(0, 30, 30);
    } 
    // Phase 2: Cluster 1 forming (Novelty detected) (4-7s)
    else if (tMod >= 4 && tMod < 7) {
       if(tMod === 4 && clusters.length < 2) setClusters(prev => [...prev, {id: 1, x: 70, y: 70, color: colors[1]}]);
       addPoint(1, 70, 70);
    }
    // Phase 3: Cluster 2 forming (8-10s)
    else if (tMod >= 8 && tMod < 11) {
       if(tMod === 8 && clusters.length < 3) setClusters(prev => [...prev, {id: 2, x: 70, y: 30, color: colors[2]}]);
       addPoint(2, 70, 30);
    }
    // Reset
    else if (tMod === 11) {
        setPoints([]);
        setClusters([]);
    }
  }, [time]);

  const addPoint = (clusterId: number, cx: number, cy: number) => {
      const jitter = 15;
      const nx = cx + (Math.random() - 0.5) * jitter;
      const ny = cy + (Math.random() - 0.5) * jitter;
      setPoints(prev => [...prev.slice(-15), {id: Date.now(), x: nx, y: ny, cluster: clusterId}]);
  };

  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-sm border border-stone-200 w-full">
      <h3 className="font-serif text-xl mb-2 text-stone-800">动态聚类构建</h3>
      <div className="flex items-center gap-2 text-xs text-stone-500 mb-6">
         <div className="flex items-center gap-1"><div className="w-2 h-2 bg-stone-800 rounded-full"></div> 数据点</div>
         <div className="flex items-center gap-1"><div className="w-3 h-3 border-2 border-stone-400 border-dashed rounded-full"></div> 记忆聚类</div>
      </div>
      
      <div className="relative w-full max-w-xs aspect-square bg-[#F9F8F4] rounded-lg border border-stone-200 overflow-hidden">
         {/* Clusters Areas */}
         {clusters.map(c => (
             <motion.div 
                key={`c-${c.id}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.15 }}
                className={`absolute w-32 h-32 -ml-16 -mt-16 rounded-full ${c.color}`}
                style={{ left: `${c.x}%`, top: `${c.y}%` }}
             />
         ))}
         
         {/* Cluster Prototypes (Centers) */}
         {clusters.map(c => (
             <motion.div 
                key={`cp-${c.id}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`absolute w-4 h-4 -ml-2 -mt-2 rounded-full border-2 border-white shadow-sm z-10 ${c.color}`}
                style={{ left: `${c.x}%`, top: `${c.y}%` }}
             />
         ))}

         {/* Data Points */}
         {points.map(p => (
             <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`absolute w-2 h-2 -ml-1 -mt-1 rounded-full bg-stone-700`}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
             />
         ))}
         
         {time % 12 >= 4 && time % 12 < 5 && (
             <div className="absolute inset-0 flex items-center justify-center">
                 <div className="bg-white/90 px-3 py-1 rounded text-xs font-bold text-stone-800 shadow-sm animate-bounce">发现新分布! 扩展记忆</div>
             </div>
         )}
      </div>
    </div>
  );
};

// --- LOGIC FLOW DIAGRAM ---
export const LogicFlowDiagram: React.FC = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
        setStep(s => (s + 1) % 4);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const steps = [
      { icon: Search, title: "样本选择", desc: "计算KDM，匹配最近聚类" },
      { icon: Database, title: "检查扩展", desc: "差异 > 阈值 λ? 创建新聚类" },
      { icon: Scissors, title: "内存修剪", desc: "内存满? 移除重叠聚类" },
      { icon: Network, title: "模型更新", desc: "基于DCM数据训练DDPM" }
  ];

  return (
    <div className="flex flex-col items-center p-8 bg-[#F5F4F0] rounded-xl border border-stone-200 w-full">
      <h3 className="font-serif text-xl mb-6 text-stone-900">DCM 算法流程</h3>
      
      <div className="flex flex-col gap-4 w-full max-w-sm">
          {steps.map((s, i) => {
              const isActive = step === i;
              const isPast = step > i;
              return (
                  <div key={i} className={`flex items-center gap-4 p-3 rounded-lg border transition-all duration-500 ${isActive ? 'bg-white border-nobel-gold shadow-md scale-105' : 'bg-transparent border-stone-200 opacity-60'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-500'}`}>
                          <s.icon size={18} />
                      </div>
                      <div className="flex-1">
                          <h4 className={`font-bold text-sm ${isActive ? 'text-stone-900' : 'text-stone-500'}`}>{s.title}</h4>
                          <p className="text-xs text-stone-500">{s.desc}</p>
                      </div>
                      {isActive && <div className="w-2 h-2 bg-nobel-gold rounded-full animate-pulse"></div>}
                  </div>
              )
          })}
      </div>
    </div>
  );
};

// --- COMPARISON CHART ---
export const ComparisonChart: React.FC = () => {
    const [dataset, setDataset] = useState<'mnist' | 'cifar10'>('cifar10');
    
    // Data based on Table 1 in paper (Average FID scores, lower is better)
    // Approximate values for visual representation
    const data = {
        mnist: { 
            dcm: 28.57, // DCM-SE
            baselines: [
                { name: 'LTS', val: 71.67 },
                { name: 'R-DDPM', val: 63.26 },
                { name: 'CGKD', val: 54.34 }
            ]
        },
        cifar10: { 
            dcm: 76.58, // DCM-JS (Better on CIFAR)
            baselines: [
                { name: 'LTS', val: 124.22 },
                { name: 'R-DDPM', val: 106.18 },
                { name: 'CGKD', val: 115.38 }
            ]
        }
    };

    const currentData = data[dataset];
    const maxVal = Math.max(currentData.dcm, ...currentData.baselines.map(b => b.val)) * 1.1;

    return (
        <div className="flex flex-col gap-8 p-8 bg-stone-900 text-stone-100 rounded-xl my-8 border border-stone-800 shadow-lg">
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="font-serif text-xl mb-2 text-nobel-gold">FID 分数对比 (越低越好)</h3>
                    <p className="text-stone-400 text-sm max-w-md">
                        DCM 在生成质量上显著优于 Replay-DDPM 和 CGKD 等方法，证明了动态记忆管理的有效性。
                    </p>
                </div>
                <div className="flex gap-2 bg-stone-800 p-1 rounded-lg">
                    <button onClick={() => setDataset('mnist')} className={`px-3 py-1 text-xs font-bold rounded transition-colors ${dataset === 'mnist' ? 'bg-stone-600 text-white' : 'text-stone-400 hover:text-white'}`}>MNIST</button>
                    <button onClick={() => setDataset('cifar10')} className={`px-3 py-1 text-xs font-bold rounded transition-colors ${dataset === 'cifar10' ? 'bg-stone-600 text-white' : 'text-stone-400 hover:text-white'}`}>CIFAR10</button>
                </div>
            </div>
            
            <div className="w-full h-48 flex items-end justify-between gap-4 relative">
                {/* Background lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10 z-0">
                    {[0, 1, 2, 3].map(i => <div key={i} className="w-full h-[1px] bg-white"></div>)}
                </div>

                {/* DCM Bar */}
                <div className="flex-1 flex flex-col items-center justify-end h-full z-10 group">
                    <div className="text-nobel-gold font-mono text-sm font-bold mb-2 opacity-0 group-hover:opacity-100 transition-opacity">{currentData.dcm}</div>
                    <motion.div 
                        className="w-full max-w-[60px] bg-gradient-to-t from-nobel-gold to-[#E5C885] rounded-t-md relative overflow-hidden shadow-[0_0_15px_rgba(197,160,89,0.3)]"
                        initial={{ height: 0 }}
                        animate={{ height: `${(currentData.dcm / maxVal) * 100}%` }}
                        transition={{ type: "spring", stiffness: 60 }}
                    >
                       <div className="absolute inset-0 bg-white/20 transform skew-x-12 -translate-x-full animate-[shimmer_2s_infinite]"></div>
                    </motion.div>
                    <div className="mt-3 text-xs font-bold text-nobel-gold tracking-wider">DCM (本文)</div>
                </div>

                {/* Baseline Bars */}
                {currentData.baselines.map((b, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full z-10 group">
                        <div className="text-stone-400 font-mono text-sm font-bold mb-2 opacity-0 group-hover:opacity-100 transition-opacity">{b.val}</div>
                        <motion.div 
                            className="w-full max-w-[60px] bg-stone-700 rounded-t-md border-t border-stone-600"
                            initial={{ height: 0 }}
                            animate={{ height: `${(b.val / maxVal) * 100}%` }}
                            transition={{ type: "spring", stiffness: 60, delay: i * 0.1 }}
                        />
                        <div className="mt-3 text-xs font-medium text-stone-500">{b.name}</div>
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                <BarChart2 size={14} />
                数据来源: Table 1 (Split {dataset === 'mnist' ? 'MNIST' : 'CIFAR10'})
            </div>
        </div>
    )
}
