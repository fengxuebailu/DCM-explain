
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { ClusterHeroScene, NetworkBackgroundScene } from './components/QuantumScene';
import { ClusterFormationDiagram, LogicFlowDiagram, ComparisonChart } from './components/Diagrams';
import { CodeViewer } from './components/CodeViewer';
import { ArrowDown, Menu, X, BookOpen, Github } from 'lucide-react';

const AuthorCard = ({ name, role, delay, institution }: { name: string, role: string, delay: string, institution: string }) => {
  return (
    <div className="flex flex-col group animate-fade-in-up items-center p-8 bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-all duration-300 w-full max-w-xs hover:border-nobel-gold/50" style={{ animationDelay: delay }}>
      <h3 className="font-serif text-2xl text-stone-900 text-center mb-2">{name}</h3>
      <p className="text-xs text-stone-400 text-center mb-4 h-8 flex items-center justify-center">{institution}</p>
      <div className="w-12 h-0.5 bg-nobel-gold mb-4 opacity-60"></div>
      <p className="text-xs text-stone-500 font-bold uppercase tracking-widest text-center leading-relaxed">{role}</p>
    </div>
  );
};

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F4] text-stone-800 selection:bg-nobel-gold selection:text-white font-sans">
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#F9F8F4]/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 bg-nobel-gold rounded-full flex items-center justify-center text-white font-serif font-bold text-xl shadow-sm pb-1">D</div>
            <span className={`font-serif font-bold text-lg tracking-wide transition-opacity ${scrolled ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>
              DCM <span className="font-normal text-stone-500">CVPR 2024</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-stone-600">
            <a href="#introduction" onClick={scrollToSection('introduction')} className="hover:text-nobel-gold transition-colors cursor-pointer uppercase">简介</a>
            <a href="#method" onClick={scrollToSection('method')} className="hover:text-nobel-gold transition-colors cursor-pointer uppercase">方法</a>
            <a href="#code" onClick={scrollToSection('code')} className="hover:text-nobel-gold transition-colors cursor-pointer uppercase">代码</a>
            <a href="#results" onClick={scrollToSection('results')} className="hover:text-nobel-gold transition-colors cursor-pointer uppercase">实验结果</a>
            <a href="#authors" onClick={scrollToSection('authors')} className="hover:text-nobel-gold transition-colors cursor-pointer uppercase">作者</a>
            <a 
              href="https://doi.org/10.1109/CVPR52733.2024.02476" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-5 py-2 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors shadow-sm cursor-pointer"
            >
              论文详情
            </a>
          </div>

          <button className="md:hidden text-stone-900 p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#F9F8F4] flex flex-col items-center justify-center gap-8 text-xl font-serif animate-fade-in">
            <a href="#introduction" onClick={scrollToSection('introduction')} className="hover:text-nobel-gold transition-colors cursor-pointer uppercase">简介</a>
            <a href="#method" onClick={scrollToSection('method')} className="hover:text-nobel-gold transition-colors cursor-pointer uppercase">方法</a>
            <a href="#code" onClick={scrollToSection('code')} className="hover:text-nobel-gold transition-colors cursor-pointer uppercase">代码</a>
            <a href="#results" onClick={scrollToSection('results')} className="hover:text-nobel-gold transition-colors cursor-pointer uppercase">实验结果</a>
            <a href="#authors" onClick={scrollToSection('authors')} className="hover:text-nobel-gold transition-colors cursor-pointer uppercase">作者</a>
            <a 
              href="https://doi.org/10.1109/CVPR52733.2024.02476" 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => setMenuOpen(false)} 
              className="px-6 py-3 bg-stone-900 text-white rounded-full shadow-lg cursor-pointer"
            >
              论文详情
            </a>
        </div>
      )}

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <ClusterHeroScene />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(249,248,244,0.85)_0%,rgba(249,248,244,0.5)_60%,rgba(249,248,244,0.2)_100%)]" />

        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="inline-block mb-4 px-3 py-1 border border-nobel-gold text-nobel-gold text-xs tracking-[0.2em] uppercase font-bold rounded-full backdrop-blur-sm bg-white/30">
            CVPR • 2024
          </div>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-8xl font-medium leading-tight mb-8 text-stone-900 drop-shadow-sm">
            动态聚类记忆 <br/><span className="italic font-normal text-stone-600 text-2xl md:text-4xl block mt-6">在线无任务持续生成与判别学习</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-stone-700 font-light leading-relaxed mb-12">
            一种全新的非参数化记忆管理方法 (DCM)，无需监督信号即可在动态数据流中捕捉分布变化，解决灾难性遗忘问题。
          </p>
          
          <div className="flex justify-center gap-4">
             <a href="#introduction" onClick={scrollToSection('introduction')} className="group flex flex-col items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors cursor-pointer">
                <span>探索研究</span>
                <span className="p-2 border border-stone-300 rounded-full group-hover:border-stone-900 transition-colors bg-white/50">
                    <ArrowDown size={16} />
                </span>
             </a>
          </div>
        </div>
      </header>

      <main>
        {/* Introduction */}
        <section id="introduction" className="py-24 bg-white">
          <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-4">
              <div className="inline-block mb-3 text-xs font-bold tracking-widest text-stone-500 uppercase">背景挑战</div>
              <h2 className="font-serif text-4xl mb-6 leading-tight text-stone-900">无监督持续学习</h2>
              <div className="w-16 h-1 bg-nobel-gold mb-6"></div>
            </div>
            <div className="md:col-span-8 text-lg text-stone-600 leading-relaxed space-y-6">
              <p>
                <span className="text-5xl float-left mr-3 mt-[-8px] font-serif text-nobel-gold">在</span>现代深度学习中，模型在学习新任务时往往会彻底遗忘旧知识，这种现象被称为<strong>灾难性遗忘 (Catastrophic Forgetting)</strong>。
              </p>
              <p>
                虽然已有许多基于记忆（Replay）的方法尝试解决此问题，但它们大多依赖于<strong>监督信号（标签）</strong>来筛选存储的样本。这使得它们在无监督的<strong>在线无任务持续学习 (OTFCL)</strong> 场景下失效，因为模型无法预知任务边界，也无法获取标签。
              </p>
              <p>
                本研究提出了 **Dynamic Cluster Memory (DCM)**，这是一个即插即用、无需模型的记忆管理系统。它能够自动构建聚类来捕捉数据分布的偏移，在无需任何监督信号的情况下，高效地管理有限的记忆资源。
              </p>
            </div>
          </div>
        </section>

        {/* Method Section */}
        <section id="method" className="py-24 bg-[#F5F4F0] relative overflow-hidden">
           <div className="container mx-auto px-6 md:px-12 relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-16">
                  <div className="inline-block mb-3 text-xs font-bold tracking-widest text-stone-500 uppercase">核心方法</div>
                  <h2 className="font-serif text-4xl md:text-5xl mb-6 text-stone-900">DCM 的工作机制</h2>
                  <p className="text-lg text-stone-600">
                    利用“知识差异度量 (KDM)”来评估数据的新颖性，动态地扩展和修剪记忆聚类。
                  </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
                  <div>
                     <h3 className="font-serif text-2xl mb-4 text-stone-900">1. 动态聚类扩展</h3>
                     <p className="text-stone-600 mb-6 leading-relaxed">
                       当数据流进入时，DCM 使用 KDM 计算新样本与现有聚类原型的差异。如果差异足够大（超过阈值 λ），系统会识别出分布偏移，并创建一个新的记忆聚类来存储这些新颖样本。
                     </p>
                     <ClusterFormationDiagram />
                  </div>
                  
                  <div>
                      <h3 className="font-serif text-2xl mb-4 text-stone-900">2. 智能样本选择与修剪</h3>
                      <p className="text-stone-600 mb-6 leading-relaxed">
                        为了在有限内存中保持多样性，DCM 会将语义相似的样本归入同一聚类。当内存超载时，通过图关系评估（Graph Relation Evaluation）识别重叠的聚类并进行修剪，保留最具代表性的知识。
                      </p>
                      <LogicFlowDiagram />
                  </div>
              </div>
           </div>
        </section>
        
        {/* Code Section */}
        <section id="code" className="py-24 bg-stone-800 text-white">
            <div className="container mx-auto px-6 md:px-12">
                <div className="text-center max-w-3xl mx-auto mb-12">
                  <div className="inline-block mb-3 text-xs font-bold tracking-widest text-nobel-gold uppercase">实现细节</div>
                  <h2 className="font-serif text-4xl mb-6 text-white">关键代码实现</h2>
                  <p className="text-lg text-stone-400">
                    以下核心算法模块展示了 DCM 如何实现内存的动态分配、扩展与修剪，正是这些逻辑支撑了 Table 1-4 中的优异性能。
                  </p>
                </div>
                
                <div className="max-w-5xl mx-auto">
                    <CodeViewer />
                    <div className="mt-8 text-center">
                        <a 
                            href="https://github.com/dtuzi123/DCM" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-stone-300 hover:text-white transition-colors font-medium text-sm"
                        >
                            <Github size={16} />
                            访问 GitHub 仓库查看完整源码
                        </a>
                    </div>
                </div>
            </div>
        </section>

        {/* Results Section */}
        <section id="results" className="py-24 bg-stone-900 text-white relative">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
              <NetworkBackgroundScene />
          </div>
          <div className="container mx-auto px-6 md:px-12 relative z-10">
             <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                <div className="md:col-span-5">
                   <div className="inline-block mb-3 text-xs font-bold tracking-widest text-nobel-gold uppercase">实验结果</div>
                   <h2 className="font-serif text-4xl mb-6 text-white">卓越的生成性能</h2>
                   <div className="w-16 h-1 bg-nobel-gold mb-8"></div>
                   <p className="text-stone-300 text-lg leading-relaxed mb-6">
                     我们在 Split MNIST, Fashion, SVHN, CIFAR10 等多个基准数据集上验证了 DCM。在用于训练去噪扩散概率模型 (DDPM) 时，DCM 展现出了超越最先进方法（SOTA）的性能。
                   </p>
                   <p className="text-stone-300 text-lg leading-relaxed">
                     <strong>更低的 FID 分数</strong>意味着生成的图像质量更高、更接近真实分布。DCM 不仅效果更好，而且所需的存储样本量更少。
                   </p>
                </div>
                <div className="md:col-span-7">
                   <ComparisonChart />
                </div>
             </div>
          </div>
        </section>

        {/* Authors Section */}
        <section id="authors" className="py-24 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="font-serif text-4xl mb-12 text-stone-900">论文作者</h2>
            <div className="flex flex-col md:flex-row justify-center gap-8 items-stretch">
               <AuthorCard 
                 name="Fei Ye" 
                 role="第一作者" 
                 institution="约克大学 / MBZUAI" 
                 delay="0ms" 
               />
               <AuthorCard 
                 name="Adrian G. Bors" 
                 role="通讯作者" 
                 institution="约克大学" 
                 delay="100ms" 
               />
            </div>
            <div className="mt-16 flex flex-col items-center gap-6">
              <p className="text-stone-500 italic">发表于 IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR) 2024</p>
              <div className="flex gap-4">
                <a 
                    href="https://doi.org/10.1109/CVPR52733.2024.02476" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-nobel-gold hover:text-stone-900 transition-colors font-medium uppercase tracking-wide text-sm border border-nobel-gold/30 px-4 py-2 rounded-full hover:border-stone-900"
                >
                    <BookOpen size={18} />
                    阅读 IEEE 论文
                </a>
                <a 
                    href="https://github.com/dtuzi123/DCM" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors font-medium uppercase tracking-wide text-sm border border-stone-200 px-4 py-2 rounded-full hover:border-stone-900"
                >
                    <Github size={18} />
                    查看源码
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-[#F9F8F4] py-12 border-t border-stone-200">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-3 opacity-60">
              <div className="w-6 h-6 bg-stone-900 rounded-full flex items-center justify-center text-white font-serif font-bold text-xs">D</div>
              <span className="font-serif font-bold text-stone-900">DCM RESEARCH</span>
           </div>
           <p className="text-stone-500 text-sm">
             © 2024 Fei Ye & Adrian G. Bors. 非官方可视化演示。
           </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
