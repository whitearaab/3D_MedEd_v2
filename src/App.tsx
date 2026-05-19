import React, { useState, useEffect } from 'react';
import { Menu, X, BookOpen, Layers, Lightbulb, AlertCircle, Trophy, Award, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const OUTLINE = [
  { id: 'introduction', title: 'Introduction' },
  { 
    id: 'phase-1', 
    title: 'Phase 1: Sourcing & Segmentation',
    subsections: [
      { id: 'finding-model', title: 'Finding an Existing Model' },
      { id: 'databases', title: 'Databases & Sources' },
      { id: 'formats', title: 'Understanding Formats' },
    ]
  },
  { 
    id: 'phase-2', 
    title: 'Phase 2: Inspect & Edit',
    subsections: [
      { id: 'blender', title: 'Blender' },
      { id: 'meshmixer', title: 'Meshmixer' },
    ]
  },
  { 
    id: 'phase-3', 
    title: 'Phase 3: Slicing',
    subsections: [
      { id: 'terminology', title: 'Terminology' },
      { id: 'cura', title: 'Ultimaker Cura' },
      { id: 'prusa', title: 'PrusaSlicer' },
    ]
  },
  { id: 'phase-4', title: 'Phase 4: Exporting' },
  { 
    id: 'phase-5', 
    title: 'Phase 5: Physical Printing',
    subsections: [
      { id: 'calibration', title: 'Calibration Print' },
      { id: 'first-layer', title: 'The First Layer' },
      { id: 'supports', title: 'Understanding Supports' },
      { id: 'material', title: 'Choosing Material' },
      { id: 'post-processing', title: 'Post-Processing' },
    ]
  },
  {
    id: 'ct-mri-pipeline',
    title: 'CT/MRI Pipeline',
    subsections: [
      { id: 'core-concept', title: 'Core Concept' },
      { id: 'step-1', title: 'Install "3D Slicer"' },
      { id: 'step-2', title: 'Load Medical Scans' },
      { id: 'step-3', title: 'Create 3D Model' },
      { id: 'step-4', title: 'Export STL File' },
      { id: 'step-5', title: 'Clean-Up in Blender' },
    ]
  }
];

export default function App() {
  const [activeSection, setActiveSection] = useState('introduction');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      // Only force open on large screens, don't automatically close on small ones 
      // if the user wants it expanded by default.
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = OUTLINE.flatMap(s => [s.id, ...(s.subsections?.map(sub => sub.id) || [])])
        .map(id => document.getElementById(id))
        .filter(Boolean);
        
      const current = sections.find(section => {
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= 250;
      });
      if (current) setActiveSection(current.id);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Mobile Menu Button */}
      {!isSidebarOpen && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-3 bg-white shadow-lg border border-slate-200 rounded-full lg:hidden text-ucla-darker"
        >
          <Menu size={24} />
        </button>
      )}

      <div className="flex w-full items-start mx-auto">
        {/* Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="ucla-sidebar shrink-0 lg:block hidden"
            >
              <div className="sidebar-heading">
                <BookOpen size={14} /> Contents
              </div>
              <nav className="space-y-4 px-1">
                {OUTLINE.map(section => (
                  <div key={section.id} className="space-y-1">
                    <div className="relative">
                      {activeSection === section.id && (
                        <motion.div
                          layoutId="active-nav-pill"
                          className="absolute inset-0 bg-white shadow-sm ring-1 ring-slate-200/50 rounded-xl"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <button
                        onClick={() => scrollTo(section.id)}
                        className={`relative w-full sidebar-nav-item ${activeSection === section.id ? 'active !bg-transparent !shadow-none !ring-0' : ''}`}
                      >
                        {section.title}
                      </button>
                    </div>
                    {section.subsections && (
                      <div className="mt-1 space-y-0.5 ml-2 border-l border-slate-200/50">
                        {section.subsections.map(sub => (
                          <div key={sub.id} className="relative">
                            {activeSection === sub.id && (
                              <motion.div
                                layoutId="active-sub-pill"
                                className="absolute inset-0 bg-white/70 shadow-sm rounded-lg border-l-2 border-ucla-blue"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                              />
                            )}
                            <button
                              onClick={() => scrollTo(sub.id)}
                              className={`relative w-full sidebar-nav-sub ${activeSection === sub.id ? 'active !bg-transparent !shadow-none !border-l-0' : ''}`}
                            >
                              {sub.title}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && window.innerWidth < 1024 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </AnimatePresence>
        {isSidebarOpen && window.innerWidth < 1024 && (
          <aside className="fixed top-0 left-0 bottom-0 bg-[#F4F5F7] shadow-2xl w-72 z-50 border-r border-slate-200 overflow-y-auto px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <div className="sidebar-heading !mb-0">
                <BookOpen size={14} /> Contents
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 -mr-2 text-slate-500 hover:bg-slate-200 rounded-full">
                <X size={20} />
              </button>
            </div>
              <nav className="space-y-6">
                {OUTLINE.map(section => (
                  <div key={section.id}>
                    <button
                      onClick={() => { scrollTo(section.id); setIsSidebarOpen(false); }}
                      className={`sidebar-nav-item ${activeSection === section.id ? 'active' : ''}`}
                    >
                      {section.title}
                    </button>
                    {section.subsections && (
                      <div className="mt-1 space-y-1">
                        {section.subsections.map(sub => (
                          <button
                            key={sub.id}
                            onClick={() => { scrollTo(sub.id); setIsSidebarOpen(false); }}
                            className={`sidebar-nav-sub ${activeSection === sub.id ? 'active' : ''}`}
                          >
                            {sub.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0 px-10 md:px-20 lg:px-28 pb-32 bg-white min-h-screen border-r border-slate-200 relative pt-16 lg:pt-0">
          <div className="max-w-4xl mx-auto py-12">
            
            <div className="mb-12 px-2">
              <img src="Pasted image 20260217063131.png" alt="Medical 3D Models" className="w-full rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200/50" />
            </div>

            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              id="introduction" 
              className="scroll-mt-32 mb-20 pt-4 pb-8"
            >
              <h1 className="ucla-title text-center !text-[28px] md:!text-[36px] lg:!text-[44px] leading-[1.1] mb-8 font-semibold tracking-tight">
                A Practical Guide to Open-Source 3D Printing of Anatomical Models for Medical Educational Use
              </h1>
              <p className="text-center text-1xl md:text-3xl text-ucla-blue font-serif italic mb-10 max-w-5xl mx-auto leading-tight px-4">
                A guide from the UCLA Teaching in Medical Education and Practice program
              </p>
              <div className="flex flex-col items-center gap-6 mb-24">
                <p className="text-slate-500 font-bold tracking-[0.3em] uppercase text-[13px] md:text-xs">
                  By Frank Makhlouf, Diego Cisneros, and Anissa Vera
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <div className="ucla-section-header">
                  <div className="ucla-section-line-top"></div>
                  <h2 className="text-3xl md:text-5xl font-extrabold text-ucla-darker uppercase tracking-[0.2em]">Introduction</h2>
                  <div className="ucla-section-line-bottom"></div>
                </div>

                <p className="ucla-p text-[1.25rem] leading-relaxed text-slate-800 font-medium">
                  Traditional medical models are prohibitively expensive for many global institutions. This guide outlines a validated, 100% open-source workflow to democratize medical education through 3D printing. By utilizing free software and consumer-grade hardware, educators can produce high-fidelity, patient-specific anatomical models that enhance spatial reasoning and surgical planning.
                </p>
                <p className="ucla-p text-slate-600">
                  In modern medical education, the transition from 2D radiological images to 3D physical reality is critical for student comprehension. However, the "paywall" of proprietary medical software often prevents under-resourced schools from adopting this technology. This project aims to provide a "Minimum Viable Workflow" for educators to bypass these costs using open-source tools. Here, we deliver a manual for implementing a low-cost, high-impact 3D printing lab using open-source and cost-free tools created and maintained by the community.
                </p>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              id="phase-1" 
              className="scroll-mt-32 mb-24 py-12 border-t border-slate-200"
            >
              <div className="ucla-phase-header">
                <span className="ucla-phase-number">01</span>
                <h1 className="ucla-phase-title">Sourcing &amp; Segmentation</h1>
              </div>
              
              <div id="finding-model" className="scroll-mt-32 mb-20">
                <h2 className="ucla-h2 !mt-0"><span className="number">1.1</span> Finding an Existing Medical 3D Model</h2>
                <p className="ucla-p">
                  There are two ways to obtain a model: sourcing a pre-made file or generating one from clinical data (CT/MRI). This guide will focus on utilizing ready-to-print files that require minimal modification.
                </p>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200/50 p-8 rounded-3xl shadow-sm my-10 flex flex-col md:flex-row gap-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                  <div className="bg-amber-100 p-4 rounded-2xl shrink-0 h-fit self-start">
                    <AlertCircle className="w-8 h-8 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-amber-800 font-semibold uppercase tracking-widest text-sm mb-2">Scope Disclaimer</h4>
                    <p className="text-amber-900 text-[1.1rem] font-medium m-0 leading-relaxed opacity-90">
                      Generating 3D printed models from raw imaging modalities such as CT or MRI is a complex clinical process. While mostly beyond the core scope of this beginner's guide, it will be briefly discussed in Phase 6 as an advanced pathway.
                    </p>
                  </div>
                </div>
              </div>

              <div id="databases" className="scroll-mt-32">
                <h2 className="ucla-h2"><span className="number">1.2</span> Databases &amp; Sources to Explore</h2>
                
                <div className="ucla-tier-header">
                  <div className="ucla-tier-icon text-[#b48800]">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="ucla-tier-title">Tier 1: Gold Standard</h3>
                    <p className="ucla-p text-xs font-semibold opacity-60 mb-0 mt-1 uppercase tracking-[0.2em]">Primary recommendations for medical educators.</p>
                  </div>
                </div>
                
                <div className="space-y-6 mb-8 mt-2">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <strong><a href="https://3dprint.nih.gov" target="_blank" className="text-ucla-blue hover:text-ucla-darker transition-colors underline underline-offset-4 decoration-2 text-base">NIH 3D Print Exchange</a></strong>
                    <ul className="ucla-ul text-sm opacity-90 mt-4 mb-0">
                      <li>Federally-funded, top-quality, medically accurate models that range in size from the micro- to macroscopic.</li>
                      <li>Strong set of <strong>curated collections</strong> from partner groups. High-yield starting points include the <strong><a href="https://3dprint.nih.gov/collections/heart-library" className="text-ucla-blue hover:underline">Heart Library</a></strong>, <strong><a href="https://3d.nih.gov/collections/prosthetics" className="text-ucla-blue hover:underline">Prosthetics / e-NABLE</a></strong>, and <strong><a href="https://3dprint.nih.gov/collections/neuroscience" className="text-ucla-blue hover:underline">Neuroscience</a></strong>.</li>
                      <li>Includes expert-vetted reference anatomy, such as the <strong><a href="https://3d.nih.gov/collections/hra" className="text-ucla-blue hover:underline">Human Reference Atlas (HRA) 3D Reference Object Library.</a></strong></li>
                      <li><strong>Best for:</strong> imaging-derived <em>cardiovascular anatomy</em>, <em>neurological structures</em>, and higher-trust educational prints where provenance matters.</li>
                    </ul>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <strong><a href="https://www.embodi3d.com" target="_blank" className="text-ucla-blue hover:text-ucla-darker transition-colors underline underline-offset-4 decoration-2 text-base">Embodi3D</a></strong>
                    <ul className="ucla-ul text-sm opacity-90 mt-4 mb-0">
                      <li>One of the largest libraries of 3D printable anatomical models obtained from medical imaging modalities such as CT and MRI.</li>
                      <li>Has a mixture of free and paid files, depending on quality. The library is ~30,000 files large, so the options are near limitless.</li>
                      <li>Be on the lookout for varying levels of quality via <em>popularity metrics</em>.</li>
                    </ul>
                  </div>
                </div>
                
                <div className="ucla-tip mt-6 mb-8 bg-[#FFD100]/5 border-l-4 border-ucla-gold">
                   <Lightbulb className="shrink-0 text-[#FFD100]" />
                   <div>
                     <strong>Note:</strong> The <a href="https://www.dicomlibrary.com/" target="_blank" className="text-ucla-blue underline hover:text-ucla-darker">Dicom Library</a> is also a fantastic resource for raw scans to convert yourself.
                   </div>
                </div>

                <div className="ucla-tier-header">
                  <div className="ucla-tier-icon text-ucla-blue">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="ucla-tier-title">Tier 2: Noteworthy Highlight</h3>
                    <p className="ucla-p text-xs font-semibold opacity-60 mb-0 mt-1 uppercase tracking-[0.2em]">High-quality scans from specialized sources.</p>
                  </div>
                </div>
                <div className="space-y-6 mb-8 mt-2">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <strong><a href="https://www.artec3d.com/3d-models/medical" target="_blank" className="text-ucla-blue hover:text-ucla-darker transition-colors underline underline-offset-4 decoration-2 text-base">Artec3D</a></strong>
                    <ul className="ucla-ul text-sm opacity-90 mt-4 mb-0">
                      <li>Artec3D is a developer of professional 3D scanning hardware. To demonstrate their tech, they provide a small but extremely high-quality repository of scans.</li>
                      <li>Because these are created with professional-grade scanners, the surface fidelity is far superior to any community-uploaded STL files.</li>
                      <li>The crown jewel of this repository is <strong>Eva</strong>, a single, ready-to-print file of an entire human skeleton.</li>
                    </ul>
                  </div>
                </div>

                <div className="ucla-img-wrap p-6 bg-[#F4F5F7] flex items-center justify-center flex-col shadow-sm rounded-3xl border-0">
                  <div className="ucla-iframe-wrap mb-4 shadow-lg rounded-2xl overflow-hidden border border-slate-200">
                    <iframe src="https://sketchfab.com/models/97c7ffa281a348f787d95cd33ea1e947/embed?autostart=1&autospin=0.25&preload=1&transparent=1&ui_infos=0&ui_start=0&scrollwheel=1" />
                  </div>
                  <div className="model-credit mt-2 text-[#003B5C]">
                    <a href="https://www.artec3d.com/3d-models/skeleton-forearm" target="_blank" className="font-semibold underline decoration-transparent hover:decoration-ucla-blue transition-all">Skeleton Forearm Model</a>
                    <span className="mx-2 opacity-50">courtesy of</span>
                    <a href="https://www.artec3d.com/" target="_blank" className="font-semibold underline decoration-transparent hover:decoration-ucla-blue transition-all">Artec 3D</a>
                  </div>
                </div>

                <div className="ucla-tier-header">
                  <div className="ucla-tier-icon text-orange-400">
                    <Search className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="ucla-tier-title text-orange-900/80">Tier 3: General Repositories</h3>
                    <p className="ucla-p text-xs font-semibold opacity-60 mb-0 mt-1 uppercase tracking-[0.2em]">Community-driven sources for broad searches.</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-[1fr_250px] gap-8 items-start mb-8">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm h-full">
                    <p className="font-serif font-semibold text-lg mb-4 text-slate-800">4. <a href="https://printables.com" target="_blank" className="text-ucla-blue hover:text-ucla-darker underline underline-offset-4 decoration-2">Printables</a></p>
                    <ul className="ucla-ul text-sm mb-0 mt-0">
                      <li>An open marketplace of 3D models developed by <strong>Joseph Prusa</strong>.</li>
                      <li>This repository excels in terms of <strong>ease of workflow</strong>. Many files support a built-in one-click <strong>“Open in Slicer”</strong> flow that connects directly to popular slicers.</li>
                      <li>Useful as a secondary source for medical and non-medical models. No dedicated “Medical” categories; rely on search terms.</li>
                    </ul>
                    <div className="ucla-tip mt-6 mb-0 shadow-none border bg-white">
                      <Lightbulb className="shrink-0 text-[#FFD100]" />
                      <div>
                        <strong>Tip:</strong> Search <code className="bg-[#FFD100]/20 text-[#003B5C] px-1.5 py-0.5 rounded-md font-mono text-xs font-bold">tag:anatomy</code> or <code className="bg-[#FFD100]/20 text-[#003B5C] px-1.5 py-0.5 rounded-md font-mono text-xs font-bold">tag:medical</code> for quick, relevant results.
                      </div>
                    </div>
                  </div>
                  <div className="ucla-img-wrap shadow-lg mt-0 rounded-2xl overflow-hidden p-0 border border-slate-200">
                    <img src="prusa website download buttons.png" alt="Printables download" className="w-full object-cover scale-[1.02] transform hover:scale-[1.05] transition-transform duration-500" />
                  </div>
                </div>

                <div className="mb-8">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="font-serif font-semibold text-lg mb-4 text-slate-800">5. <a href="https://www.thingiverse.com" target="_blank" className="text-ucla-blue hover:text-ucla-darker underline underline-offset-4 decoration-2">Thingiverse</a></p>
                    <ul className="ucla-ul text-sm mt-0 mb-0">
                      <li>One of the largest general-purpose 3D model marketplaces; quality is variable, but it has a surprisingly deep set of <strong>anatomy & medical</strong> uploads.</li>
                      <li>Strong community features that help you vet models quickly: <strong>likes/download counts, “Makes” (real prints)</strong>.</li>
                      <li>Mostly <strong>ready-to-print STL</strong> downloads, plus lots of <strong>remixable</strong> parts.</li>
                    </ul>
                  </div>
                </div>

                <div className="ucla-img-wrap p-6 bg-[#F4F5F7] flex items-center justify-center flex-col shadow-sm rounded-3xl border-0">
                  <div className="ucla-iframe-wrap mb-4 shadow-lg rounded-2xl overflow-hidden border border-slate-200">
                    <iframe src="https://sketchfab.com/models/337822a2d4bb43358c653dcf425e28ec/embed?autostart=1&autospin=0.2&preload=1&transparent=1&ui_infos=0&ui_start=0&scrollwheel=1" />
                  </div>
                  <div className="model-credit mt-2 text-[#003B5C]">
                    <a href="https://www.artec3d.com/3d-models/human-skeleton-hd" target="_blank" className="font-semibold underline decoration-transparent hover:decoration-ucla-blue transition-all">Eva the Skeleton</a>
                    <span className="mx-2 opacity-50">courtesy of</span>
                    <a href="https://www.artec3d.com/" target="_blank" className="font-semibold underline decoration-transparent hover:decoration-ucla-blue transition-all">Artec3D</a>
                  </div>
                </div>

              </div>

              <div id="formats" className="scroll-mt-24">
                <h2 className="ucla-h2"><span className="number">1.3</span> Understanding 3D Printing Formats</h2>
                <p className="ucla-p text-slate-600">
                  We recommend that most users primarily work with the <strong>STL file format</strong>. Other formats exist to store additional information such as color, materials, or printer settings. Understanding them helps you recognize when STL is sufficient and when another format may be useful.
                </p>

                <div className="ucla-table-container">
                  <table className="ucla-table">
                    <thead>
                      <tr>
                        <th>Format</th>
                        <th>What it is</th>
                        <th>Why It Exists</th>
                        <th>Stores</th>
                        <th>Typical Use Case</th>
                        <th>Why it matters</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="font-bold text-ucla-blue text-base">STL</td>
                        <td className="italic text-slate-500">The "Standard"</td>
                        <td className="font-medium text-slate-800">Simple, universal printing standard</td>
                        <td className="font-mono text-[11px] bg-slate-100 rounded px-2 py-1 text-slate-600 whitespace-nowrap w-fit">Geometry only</td>
                        <td className="text-slate-600">Most anatomy and educational models</td>
                        <td className="text-slate-600 leading-relaxed">Most common. Simple, widely supported, describes only <strong>surface geometry</strong>.</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="font-bold text-ucla-blue text-base">OBJ</td>
                        <td className="italic text-slate-500">The "Modern"</td>
                        <td className="font-medium text-slate-800">Supports multi-part and visual detail</td>
                        <td className="font-mono text-[11px] bg-slate-100 rounded px-2 py-1 text-slate-600 whitespace-nowrap w-fit">Geometry + color</td>
                        <td className="text-slate-600">Advanced or color-aware models</td>
                        <td className="text-slate-600 leading-relaxed">Newer. Smaller than STL, saves <strong>print settings</strong> and <strong>colors</strong>.</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="font-bold text-ucla-blue text-base">3MF</td>
                        <td className="italic text-slate-500">The "Artistic"</td>
                        <td className="font-medium text-slate-800">Modern STL replacement</td>
                        <td className="font-mono text-[11px] bg-slate-100 rounded px-2 py-1 text-slate-600 w-fit">Geometry + scale + materials + settings</td>
                        <td className="text-slate-600">Controlled labs, standardized printers</td>
                        <td className="text-slate-600 leading-relaxed">Can store texture and color. Often used with Blender.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="ucla-tip bg-white border border-[#FFD100] shadow-md mt-10">
                  <Lightbulb className="shrink-0 text-[#FFD100] w-6 h-6" />
                  <div>
                    <strong className="text-slate-900 font-semibold block mb-1">Rule of Thumb:</strong> Use <strong className="text-ucla-blue px-1 bg-ucla-blue/10 rounded">STL</strong> by default. Only consider other formats if you need <strong>color</strong>, <strong>grouped parts</strong>, or <strong>printer-specific settings</strong>.
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Phase 2 Card */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              id="phase-2" 
              className="scroll-mt-32 mb-24 py-12 border-t border-slate-200"
            >
              <div className="ucla-phase-header">
                <span className="ucla-phase-number">02</span>
                <h1 className="ucla-phase-title">Inspect or Edit the Model</h1>
              </div>
              
              <div id="blender" className="scroll-mt-32 mb-16">
                <h2 className="ucla-h2 !mt-0"><span className="number">2.1</span> <a href="https://www.blender.org" target="_blank" className="hover:text-ucla-darker text-ucla-blue underline decoration-4 underline-offset-8 transition-colors">Blender</a></h2>
                <div className="space-y-4 mb-6">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-slate-700">Excellent for previewing anatomy models in 3D, community gold standard in terms of free software</div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <span className="font-medium text-slate-800">Steeper learning curve but extremely capable:</span>
                    <ul className="ucla-ul mt-3 mb-0">
                      <li><strong className="text-slate-800">Remeshing:</strong> The Voxel Remesh tool creates a single, unified skin over the anatomy.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div id="meshmixer" className="scroll-mt-32 mt-20">
                <h2 className="ucla-h2 !mt-0"><span className="number">2.2</span> <a href="https://meshmixer.org" target="_blank" className="hover:text-ucla-darker text-ucla-blue underline decoration-4 underline-offset-8 transition-colors">Meshmixer</a></h2>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-slate-700">Beginner-friendly mesh repair and inspection for quick and simple fixes</div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <span className="font-medium text-slate-800">Hollowing (The Material Saver):</span>
                    <ul className="ucla-ul mt-3 mb-0">
                      <li>Setting: Use a 2.5mm wall thickness for student handling models.</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-slate-700">Plane Cut: Useful for creating "Sectional"</div>
                  <div className="mt-2">
                    <div className="font-mono text-sm bg-slate-800 text-slate-200 px-4 py-3 rounded-xl inline-block shadow-lg">
                      <span className="text-slate-400">Mac:</span> <a href="https://web.archive.org/web/20200220222607/http://www.meshmixer.com/download.html" className="text-ucla-lighter hover:underline">Download link</a><br/>
                      <span className="text-slate-400">Win:</span> <a href="https://apps.autodesk.com/FUSION/en/Detail/Index?id=4108920185261935100&appLang=en&os=Win64" className="text-ucla-lighter mt-1 inline-block hover:underline">Download link</a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Phase 3 Card */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              id="phase-3" 
              className="scroll-mt-32 mb-24 py-12 border-t border-slate-200"
            >
              <div className="ucla-phase-header">
                <span className="ucla-phase-number">03</span>
                <h1 className="ucla-phase-title">Slicing of Models</h1>
              </div>
              
              <div id="terminology" className="scroll-mt-32 mb-16">
                <h2 className="ucla-h2 !mt-0"><span className="number">3.1</span> Getting Comfortable With Terminology: Slicing, G-Code</h2>
                <p className="ucla-p text-slate-600">
                  Unlike traditional printing, a 3D printer <em>cannot directly interpret</em> a model file such as STL. Instead, the model must first be translated into a set of step-by-step instructions that the printer can execute. This translation process is called "<u>slicing</u>."
                </p>
                <div className="bg-white border rounded-2xl p-8 shadow-sm my-8 border-l-[3px] border-l-ucla-blue">
                  <p className="text-ucla-darker mb-4 font-serif italic text-lg">Think of the difference between architectural drawings and construction instructions.</p>
                  <ul className="ucla-ul mb-0">
                    <li>An STL file describes <u>what</u> the object looks like, not <u>how</u> to build it.</li>
                    <li>Slicing software acts as the translator, converting the 3D shape into a layer-by-layer instruction set generating a <strong className="text-slate-800 bg-slate-100 px-1 rounded">"G-code"</strong> file.</li>
                  </ul>
                </div>
              </div>

              <div id="cura" className="scroll-mt-32 mb-20">
                <h2 className="ucla-h2 !mt-0"><span className="number">3.2</span> Plug-and-Play Solution: Ultimaker Cura</h2>
                <div className="grid md:grid-cols-[1fr_200px] gap-8 bg-slate-100/50 p-6 rounded-3xl border border-slate-200">
                  <div>
                    <h4 className="font-semibold text-ucla-darker mb-6 font-serif text-xl border-l-[3px] border-ucla-gold pl-4 italic">When you think "Cura" think "Compatibility"</h4>
                    <ul className="ucla-ul mb-0">
                      <li>Broad support for most consumer and commercial printers.</li>
                      <li>Beginner-friendly interface with strong default profiles.</li>
                      <li>
                        Docs: 
                        <a href="https://www.youtube.com/watch?v=RPQ39kQkR0Y" target="_blank" className="font-mono text-[13px] bg-slate-100 rounded px-2 py-0.5 text-ucla-blue hover:text-ucla-darker ml-2 transition-colors">Teaching Tech</a>
                        <a href="https://www.youtube.com/watch?v=wAqE-Zxi1_w" target="_blank" className="font-mono text-[13px] bg-slate-100 rounded px-2 py-0.5 text-ucla-blue hover:text-ucla-darker ml-2 transition-colors">CHEP</a>
                      </li>
                    </ul>
                  </div>
                  <div className="ucla-img-wrap flex items-center justify-center p-6 bg-white mt-0 border-slate-200 shadow-md !rounded-2xl shrink-0 self-center">
                    <img src="Ultimaker Cura logo.png" className="w-full rounded-lg" alt="Cura logo"/>
                  </div>
                </div>
              </div>

              <div id="prusa" className="scroll-mt-32">
                <h2 className="ucla-h2 !mt-0"><span className="number">3.3</span> For Customizability: PrusaSlicer</h2>
                <div className="grid md:grid-cols-[1fr_200px] gap-8 bg-slate-100/50 p-6 rounded-3xl border border-slate-200">
                  <div>
                    <h4 className="font-semibold text-ucla-darker mb-6 font-serif text-xl border-l-[3px] border-ucla-gold pl-4 italic">When you think "PrusaSlicer" think "Personalization"</h4>
                    <ul className="ucla-ul mb-0">
                      <li>Highly granular control over print settings.</li>
                      <li><strong>Powerful per-model controls:</strong> Paint-on supports, Modifiers, Variable layer height.</li>
                      <li>Robust multi-material workflows.</li>
                    </ul>
                  </div>
                  <div className="ucla-img-wrap flex items-center justify-center p-6 bg-white mt-0 border-slate-200 shadow-md !rounded-2xl shrink-0 self-center">
                    <img src="PrusaSlicer logo.png" className="w-full rounded-lg" alt="Prusa logo"/>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Phase 4 Card */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              id="phase-4" 
              className="scroll-mt-32 mb-24 py-12 border-t border-slate-200"
            >
              <div className="ucla-phase-header">
                <span className="ucla-phase-number">04</span>
                <h1 className="ucla-phase-title">Exporting Your Files For Printing</h1>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                <ul className="list-[decimal] pl-5 space-y-6 mb-0 marker:text-ucla-blue marker:font-bold marker:text-lg">
                  <li className="bg-slate-50 p-4 rounded-xl border border-slate-100 pl-2">
                    <strong className="text-slate-800 text-lg block mb-1">SD Card or USB Drive (Most Reliable)</strong> 
                    <span className="text-slate-600 block mt-1">This is the most common and dependable offline method. Computer crashes won't interrupt the print.</span>
                  </li>
                  <li className="bg-slate-50 p-4 rounded-xl border border-slate-100 pl-2">
                    <strong className="text-slate-800 text-lg block mb-1">Direct USB Connection</strong> 
                    <span className="text-slate-600 block mt-1">Best for short prints. Vulnerable to computer sleep or disconnections.</span>
                  </li>
                  <li className="bg-slate-50 p-4 rounded-xl border border-slate-100 pl-2">
                    <strong className="text-slate-800 text-lg block mb-1">Network Printing</strong> 
                    <span className="text-slate-600 block mt-1">Advanced setups via Raspberry Pi (OctoPrint) or Wi-Fi.</span>
                  </li>
                </ul>
              </div>

              <div className="ucla-warning mt-10 shadow-md outline outline-1 outline-red-200 bg-red-50">
                <AlertCircle className="shrink-0 text-red-500 w-6 h-6" />
                <div>
                  <strong className="text-red-900 font-semibold block mb-1 text-lg">Network Security Advisory:</strong> 
                  <span className="text-red-800 leading-relaxed block">We strongly advise caution when using network printing over public university Wi-Fi, as this could expose your printer to the entire campus network. For most educational settings, the <strong>SD Card / USB Drive</strong> method is optimal.</span>
                </div>
              </div>
            </motion.section>

            {/* Phase 5 Card */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              id="phase-5" 
              className="scroll-mt-32 mb-24 py-12 border-t border-slate-200"
            >
              <div className="ucla-phase-header">
                <span className="ucla-phase-number">05</span>
                <h1 className="ucla-phase-title">Physical Printing &amp; Post-processing</h1>
              </div>

              <div className="grid lg:grid-cols-2 gap-x-12 gap-y-8">
                <div id="calibration" className="scroll-mt-24 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-ucla-gold/10 rounded-bl-[100px] -z-0"></div>
                  <h2 className="ucla-h2 !mt-0 relative z-10"><span className="number">5.1</span> The Calibration Print</h2>
                  <p className="ucla-p text-sm text-slate-600 leading-relaxed relative z-10">Before complex models, print small calibration models (Calibration Cube, Temperature Tower, Retraction Tower) to fine-tune dimensional accuracy and temperature settings.</p>
                </div>

                <div id="first-layer" className="scroll-mt-24 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-ucla-blue/10 rounded-bl-[100px] -z-0"></div>
                  <h2 className="ucla-h2 !mt-0 relative z-10"><span className="number">5.2</span> The First Layer</h2>
                  <ul className="ucla-ul !mb-0 text-sm relative z-10">
                    <li><strong>A Clean Surface:</strong> Wipe bed with 70% Isopropyl Alcohol.</li>
                    <li><strong>Use a Brim:</strong> For models with a small footprint to prevent tipping.</li>
                  </ul>
                </div>

                <div id="supports" className="scroll-mt-24 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-ucla-darker/10 rounded-bl-[100px] -z-0"></div>
                  <h2 className="ucla-h2 !mt-0 relative z-10"><span className="number">5.3</span> Understanding Supports</h2>
                  <ul className="ucla-ul !mb-0 text-sm relative z-10">
                    <li><strong>Tree Supports:</strong> Branch out to touch only necessary points. Saves material, easier to remove.</li>
                    <li><strong>Density:</strong> 10% to 12% is the sweet spot.</li>
                  </ul>
                </div>

                <div id="material" className="scroll-mt-24 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-[100px] -z-0"></div>
                  <h2 className="ucla-h2 !mt-0 relative z-10"><span className="number">5.4</span> Choosing Material</h2>
                  <ul className="ucla-ul !mb-0 text-sm relative z-10">
                    <li><strong>Polylactic Acid (PLA):</strong> Default, rigid, easy to print.</li>
                    <li><strong>Thermoplastic Polyurethane (TPU):</strong> Flexible, rubber-like. Absorbs moisture!</li>
                  </ul>
                  
                  <div className="mt-8 relative z-10">
                    <h3 className="font-semibold text-slate-800 text-sm mb-3">Ultrasound Material Properties</h3>
                    <div className="p-1 border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                      <img src="Screenshot 2026-02-18 at 4.21.36 PM.png" alt="Ultrasound Material Properties Table" className="w-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div id="post-processing" className="scroll-mt-24 mt-8 bg-white p-8 lg:p-10 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="ucla-h2 !mt-0"><span className="number">5.5</span> Post-Processing</h2>
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100"><strong>Finishing:</strong> A brief application of a heat gun removes white stress marks from support removal.</div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100"><strong>Anatomical Highlighting:</strong> Use acrylic markers to highlight landmarks (e.g., Sella Turcica).</div>
                </div>
              </div>
            </motion.section>

            {/* CT/MRI Pipeline Card */}
            <motion.section 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              id="ct-mri-pipeline" 
              className="scroll-mt-32 mb-24 py-12 border-t border-slate-200 relative overflow-hidden"
            >
              <div className="ucla-phase-header border-0 !mb-0">
                <span className="ucla-phase-number opacity-5">∞</span>
                <h1 className="ucla-phase-title">CT/MRI Pipeline</h1>
              </div>
              
              <div id="core-concept" className="scroll-mt-32 relative z-10">
                <p className="text-center text-xl md:text-2xl max-w-3xl mx-auto mb-20 text-slate-600 leading-relaxed font-medium">
                  A simplified, step-by-step workflow converting medical imaging data into an STL file using <strong className="text-ucla-darker">3D Slicer</strong> and <strong className="text-ucla-darker">Blender</strong>.
                </p>

                <div className="ucla-img-wrap shadow-2xl border-0 mb-24 rounded-3xl mx-auto max-w-4xl overflow-hidden p-2 bg-slate-50 border border-slate-100">
                  <img src="CT to 3D flowchart.png" alt="CT to 3D Flowchart" className="w-full rounded-2xl" />
                </div>

                <div className="grid md:grid-cols-3 gap-12 mb-24">
                  <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm text-center relative pt-12">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-ucla-darker text-white rounded-full flex items-center justify-center text-2xl font-semibold font-serif shadow-xl border-4 border-white">1</div>
                    <h3 className="font-semibold text-xl text-slate-800 mb-3 uppercase tracking-wider">Loading Data</h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">Start with a medical scan folder (DICOM series). Load this into 3D Slicer.</p>
                  </div>
                  <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm text-center relative pt-12">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-ucla-blue text-white rounded-full flex items-center justify-center text-2xl font-semibold font-serif shadow-xl border-4 border-white">2</div>
                    <h3 className="font-semibold text-xl text-slate-800 mb-3 uppercase tracking-wider">Segmentation</h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">"Color in" the anatomy you want to print, isolating it from muscle and skin.</p>
                  </div>
                  <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm text-center relative pt-12">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-ucla-gold text-ucla-darker rounded-full flex items-center justify-center text-2xl font-semibold font-serif shadow-xl border-4 border-white">3</div>
                    <h3 className="font-semibold text-xl text-slate-800 mb-3 uppercase tracking-wider">Exporting</h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">Export the 3D digital model as an STL file for your slicer software.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-24 relative z-10 mt-20">
                <div id="step-1" className="scroll-mt-32 bg-slate-50 p-8 md:p-12 rounded-[32px] border border-slate-200">
                  <h2 className="ucla-h2 !mt-0 !mb-8"><span className="number">Step 1</span> Install "3D Slicer"</h2>
                  <div className="bg-white rounded-2xl p-4 shadow-xl border border-slate-100 max-w-3xl mx-auto mb-10">
                    <img src="3D Slicer - Step 1.png" alt="3D Slicer Welcome Screen" className="w-full rounded-xl" />
                  </div>
                  <p className="ucla-p text-center !mb-0 font-bold text-lg">Download the "Stable" macOS/Windows version from <a href="https://download.slicer.org" target="_blank" className="text-ucla-blue hover:text-ucla-darker underline decoration-4 underline-offset-8 transition-colors">download.slicer.org</a>.</p>
                </div>

                <div id="step-2" className="scroll-mt-32 bg-white p-8 md:p-12 rounded-[32px] border border-slate-200 shadow-md relative overflow-hidden">
                  <h2 className="ucla-h2 !mt-0 mb-10"><span className="number">Step 2</span> Load Your Medical Scans (DICOM)</h2>
                  <div className="grid md:grid-cols-[1fr_minmax(250px,350px)] gap-12 items-center">
                    <div>
                      <ul className="ucla-ul space-y-6">
                        <li className="text-lg">Click the <strong>DICOM</strong> button under the Welcome banner, or via <code className="bg-slate-100 px-2 py-1 rounded border border-slate-200 font-mono text-sm text-slate-800">File → Add DICOM Data</code>.</li>
                        <li className="text-lg">Import the folder containing the scan files.</li>
                        <li className="text-lg">Select the detected patient/study and click <strong>Load</strong>.</li>
                      </ul>
                    </div>
                    <div className="flex flex-col gap-8">
                      <div className="p-2 border border-slate-200 rounded-2xl bg-slate-50 shadow-inner">
                        <img src="3D Slicer - DICOM Button.png" className="rounded-xl w-full" alt="Button" />
                      </div>
                      <div className="p-2 border border-slate-200 rounded-2xl bg-slate-50 shadow-inner">
                        <img src="3D Slicer - Step 5.png" className="rounded-xl w-full" alt="Select study" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-12 p-3 bg-slate-900 rounded-[32px] mx-auto max-w-4xl border-[6px] border-slate-800 shadow-2xl">
                    <img src="3D Slicer - Step 6.png" alt="2D Slices" className="rounded-2xl w-full opacity-90" />
                  </div>
                </div>

                <div id="step-3" className="scroll-mt-32 bg-slate-50 p-8 md:p-12 rounded-[32px] border border-slate-200">
                  <h2 className="ucla-h2 !mt-0 mb-10"><span className="number">Step 3</span> Create a 3D Model with "Segment Editor"</h2>
                  <div className="flex flex-col md:flex-row gap-12">
                    <div className="flex-1">
                      <ul className="ucla-ul space-y-6">
                        <li className="text-lg">Go to <strong className="text-ucla-darker">Welcome → Segment Editor</strong>.</li>
                        <li className="text-lg">Click <strong className="text-white bg-ucla-blue px-3 py-1 rounded-lg border border-ucla-darker shadow-sm">+ Add</strong> to create a new segment.</li>
                        <li className="text-lg">Select the <strong className="text-ucla-darker font-semibold">"Threshold"</strong> tool. Drag slider to highlight target anatomy (bone is very bright).</li>
                        <li className="text-lg">Click <strong className="text-ucla-darker font-semibold">"Apply"</strong>, then <strong className="text-ucla-darker font-semibold">"Show 3D"</strong> to preview.</li>
                      </ul>
                    </div>
                    <div className="w-full md:w-80 shrink-0">
                      <div className="bg-white p-3 border border-slate-200 shadow-xl rounded-3xl rotate-2">
                        <img src="Screenshot 2026-02-17 at 7.18.01 PM.png" className="w-full rounded-2xl" alt="Segment Editor dropdown" />
                      </div>
                    </div>
                  </div>
                </div>

                <div id="step-4" className="scroll-mt-32 bg-white p-8 md:p-12 rounded-[32px] border border-slate-200 shadow-lg relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-500/5 -skew-x-12 translate-x-20"></div>
                  <h2 className="ucla-h2 !mt-0 relative z-10"><span className="number">Step 4</span> Export Your STL</h2>
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-[32px] p-12 text-center shadow-inner relative z-10 max-w-3xl mx-auto">
                    <p className="text-emerald-900 text-xl mb-8 font-medium leading-relaxed">Under "Export/import models", select <strong className="text-black bg-white px-3 py-1 rounded-lg shadow-sm border border-emerald-100 mx-1">STL</strong> as your format, choose your destination, and click Export.</p>
                    <p className="font-serif italic text-emerald-800 text-4xl font-semibold tracking-tight drop-shadow-sm">You now have a 3D printable STL file!</p>
                  </div>
                </div>

                <div id="step-5" className="scroll-mt-32 bg-slate-50 p-8 md:p-12 rounded-[32px] border border-slate-200">
                  <h2 className="ucla-h2 !mt-0 mb-10"><span className="number">Step 5</span> (Optional) Refine in Blender</h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <strong className="text-ucla-blue text-xl block mb-3 font-semibold uppercase tracking-tight">Repairing</strong> 
                      <p className="text-slate-600 leading-relaxed">Use the "3D-Print Toolbox" add-on. Click <span className="font-semibold bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">Make Manifold</span> to fix holes and intersect geometries.</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <strong className="text-ucla-blue text-xl block mb-3 font-semibold uppercase tracking-tight">Hollowing</strong> 
                      <p className="text-slate-600 leading-relaxed">Use "Solidify" modifier. Adjust offset and thickness (e.g., 2.5mm) to save material while maintaining strength.</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow uppercase tracking-tight">
                      <strong className="text-ucla-blue text-xl block mb-3 font-semibold">Cutting</strong> 
                      <p className="text-slate-600 leading-relaxed lowercase">Edit mode → <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-sm border border-slate-200 font-semibold">Mesh → Bisect</code> to create anatomical sectional views.</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <strong className="text-ucla-blue text-xl block mb-3 font-semibold uppercase tracking-tight">Export</strong> 
                      <p className="text-slate-600 leading-relaxed">Ensure selection is active, then <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-sm border border-slate-200 font-semibold">File → Export → Stl (.stl)</code>.</p>
                    </div>
                  </div>
                </div>

              </div>
            </motion.section>

          </div>
        </main>
      </div>
    </div>
  );
}
