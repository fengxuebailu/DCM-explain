
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Terminal, Cpu, GitBranch, Layers } from 'lucide-react';

const CodeSnippet = ({ code }: { code: string }) => {
  // Simple syntax highlighting simulation
  const lines = code.split('\n');
  return (
    <div className="font-mono text-sm leading-relaxed overflow-x-auto">
      {lines.map((line, i) => (
        <div key={i} className="table-row">
          <span className="table-cell text-stone-500 select-none pr-4 text-right w-8">{i + 1}</span>
          <span className="table-cell whitespace-pre">
            {line.split(/(\s+|[(){}[\],.]+)/).map((token, j) => {
              if (token.match(/^(class|def|return|if|else|for|in|self|import|from)$/)) return <span key={j} className="text-purple-400">{token}</span>;
              if (token.match(/^(DCM|Memory|KDM|Graph|DDPM)$/)) return <span key={j} className="text-yellow-400">{token}</span>;
              if (token.match(/^#.*/)) return <span key={j} className="text-stone-500 italic">{token}</span>;
              if (token.match(/'.*'/)) return <span key={j} className="text-green-400">{token}</span>;
              if (token.match(/".*"/)) return <span key={j} className="text-green-400">{token}</span>;
              if (token.match(/\d+/)) return <span key={j} className="text-orange-400">{token}</span>;
              if (token.match(/[A-Z][a-zA-Z0-9_]*/)) return <span key={j} className="text-blue-300">{token}</span>;
              return <span key={j} className="text-stone-300">{token}</span>;
            })}
          </span>
        </div>
      ))}
    </div>
  );
};

export const CodeViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { name: 'DCM_Core.py', icon: Layers, desc: 'DCM 整体架构与流程' },
    { name: 'Sample_Select.py', icon: GitBranch, desc: '样本选择与 KDM 计算' },
    { name: 'Expansion.py', icon: Cpu, desc: '动态扩展机制 (Eq. 10)' },
    { name: 'Pruning.py', icon: Code, desc: '图关系修剪 (Eq. 13-14)' },
  ];

  const snippets = [
`class DynamicClusterMemory(nn.Module):
    def __init__(self, memory_size, threshold_lambda):
        super().__init__()
        self.clusters = []  # 存储聚类
        self.prototypes = [] # 存储聚类原型 (Centroids)
        self.max_size = memory_size
        self.lambda_expand = threshold_lambda # 扩展阈值 (Table 1-4 关键参数)

    def forward(self, data_stream_batch):
        """
        Algorithm 1: DCM 主流程
        """
        for x in data_stream_batch:
            # 1. 样本选择 (Sample Selection)
            cluster_idx = self.sample_selection(x)
            
            # 2. 检查扩展 (Check Expansion)
            if self.check_expansion(x):
                self.create_new_cluster(x)
            
            # 3. 内存修剪 (Memory Pruning)
            if len(self.clusters) > self.max_size:
                self.prune_memory()
                
        return self.retrieve_memory()`,

`def sample_selection(self, x_input):
    """
    计算知识差异 (KDM) 并分配样本
    Eq. 6 & 11 in Paper
    """
    discrepancy_scores = []
    
    for prototype in self.prototypes:
        # 计算输入样本与每个聚类原型的 KDM 距离
        # 可以是 Square Error 或 JS Divergence
        score = self.calculate_kdm(x_input, prototype)
        discrepancy_scores.append(score)
    
    # 将样本分配给差异最小 (最相似) 的聚类
    # Eq. 11: c* = argmin FKDM(x, xc)
    nearest_cluster_idx = torch.argmin(torch.stack(discrepancy_scores))
    
    # 更新该聚类的内容
    self.clusters[nearest_cluster_idx].add(x_input)
    
    return nearest_cluster_idx`,

`def check_expansion(self, x_input):
    """
    动态扩展判断逻辑
    Eq. 10: max(FKDM) > lambda
    """
    # 计算新样本与所有现有原型的距离
    scores = [self.calculate_kdm(x_input, p) for p in self.prototypes]
    
    # 找出最相似的现有知识
    min_discrepancy = torch.min(torch.stack(scores))
    
    # 如果即使是最相似的知识，差异度依然超过阈值 lambda
    # 说明这是一个全新的分布 (New Task/Domain)
    if min_discrepancy > self.lambda_expand:
        return True  # 触发扩展！
        
    return False

def create_new_cluster(self, x_novel):
    # 将新颖样本作为新聚类的原型
    new_cluster = MemoryCluster(prototype=x_novel)
    self.clusters.append(new_cluster)
    self.prototypes.append(x_novel)`,

`def prune_memory(self):
    """
    内存修剪过程：移除重叠聚类
    Eq. 13 & 14: 基于图关系评估
    """
    # 1. 构建关系矩阵 B (Relation Matrix)
    # 计算所有聚类两两之间的相似度
    B = self.compute_relation_matrix(self.prototypes)
    
    # 2. 找到最相似的一对聚类 (g, h)
    # F_select(B) from Eq. 13
    g, h = self.find_most_overlapping_pair(B)
    
    # 3. 评估多样性分数 (Diversity Score)
    # 计算如果移除 g 或 h，剩余系统的总差异度
    score_g = self.calculate_diversity_impact(g, B)
    score_h = self.calculate_diversity_impact(h, B)
    
    # 4. 移除多样性贡献较低的那个 (保留最具代表性的)
    if score_g > score_h:
        self.remove_cluster(h)
    else:
        self.remove_cluster(g)`
  ];

  return (
    <div className="w-full bg-[#1e1e1e] rounded-xl shadow-2xl overflow-hidden border border-stone-700">
      {/* Window Header */}
      <div className="bg-[#2d2d2d] px-4 py-3 flex items-center justify-between border-b border-stone-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-stone-400 text-xs font-mono flex items-center gap-2">
           <Terminal size={12} />
           github.com/dtuzi123/DCM/core
        </div>
        <div className="w-16"></div>
      </div>

      {/* Tabs & Content Layout */}
      <div className="flex flex-col md:flex-row h-[500px]">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-[#252526] border-r border-stone-700 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible">
            {tabs.map((tab, index) => {
                const Icon = tab.icon;
                const isActive = activeTab === index;
                return (
                    <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors whitespace-nowrap border-l-2 ${isActive ? 'bg-[#37373d] text-white border-nobel-gold' : 'text-stone-400 border-transparent hover:bg-[#2a2d2e] hover:text-stone-200'}`}
                    >
                        <Icon size={16} className={isActive ? 'text-nobel-gold' : 'text-stone-500'} />
                        <div className="text-left">
                            <div className="font-mono font-medium">{tab.name}</div>
                            <div className="text-[10px] opacity-60 hidden md:block">{tab.desc}</div>
                        </div>
                    </button>
                )
            })}
        </div>

        {/* Code Area */}
        <div className="flex-1 bg-[#1e1e1e] p-6 overflow-y-auto custom-scrollbar">
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
            >
                <CodeSnippet code={snippets[activeTab]} />
            </motion.div>
        </div>
      </div>
    </div>
  );
};
