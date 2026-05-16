import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  MessageSquare, 
  Search, 
  BarChart3, 
  Bot, 
  Heart, 
  X, 
  Send, 
  ChevronRight, 
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Building2,
  Handshake,
  Wrench,
  Layers,
  Filter,
  ArrowRight,
  TrendingUp,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

type UserRole = 'ADMIN' | 'FOUNDER' | 'NONE';
type Screen = 'DISCOVERY' | 'TRACKER' | 'NETWORK' | 'AGENT' | 'FOUNDER_HUB' | 'SP_ACTIVITY' | 'PROPOSAL_BUILDER';

interface ActiveWork {
  client: string;
  task: string;
  status: string;
}

interface Member {
  id: string;
  name: string;
  type: 'MENTOR' | 'PARTNER' | 'SERVICE_PROVIDER' | 'COMPANY' | 'PROGRAMME';
  role?: string;
  expertise?: string[];
  values?: string[];
  bio?: string;
  avatar?: string;
  status?: string;
  stage?: string;
  industry?: string;
  description?: string;
  strength?: number;
  activeWork?: ActiveWork[];
  score?: number;
  compliance?: {
    ssm: 'VERIFIED' | 'PENDING' | 'EXPIRED';
    bnm: 'CLEARED' | 'UNDER_REVIEW' | 'FLAGGED';
    lhdn: 'ACTIVE' | 'AUDIT' | 'LATE';
    lastAuditDate: string;
  };
}

interface Proposal {
  id: string;
  name: string;
  suggestedMentors: string[];
  suggestedCompanies: string[];
  suggestedPartners: string[];
  suggestedProviders: string[];
  logic: string;
  status: 'PENDING' | 'APPROVED' | 'DISMISSED';
}

interface EcosystemData {
  mentors: Member[];
  companies: Member[];
  partners: Member[];
  serviceProviders: Member[];
  programs: Member[];
  linkages: any[];
  proposals: Proposal[];
}

interface Message {
  role: 'user' | 'bot';
  content: string;
}

export default function App() {
  const [role, setRole] = useState<UserRole>('NONE');
  const [activeScreen, setActiveScreen] = useState<Screen>('DISCOVERY');
  const [ecosystem, setEcosystem] = useState<EcosystemData>({ mentors: [], companies: [], partners: [], serviceProviders: [], programs: [], linkages: [] });
  const [agentChat, setAgentChat] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [networkFilter, setNetworkFilter] = useState<string>('ALL');

  useEffect(() => {
    if (role !== 'NONE') {
      const fetchData = async () => {
        try {
          const res = await fetch('/api/ecosystem');
          const data = await res.json();
          setEcosystem(data);
          // Set initial screen based on role
          if (role === 'ADMIN') setActiveScreen('TRACKER');
          else setActiveScreen('FOUNDER_HUB');
        } catch (err) {
          console.error("Failed to fetch ecosystem data", err);
        }
      };
      fetchData();
    }
  }, [role]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const newMessage: Message = { role: 'user', content: inputMessage };
    setAgentChat(prev => [...prev, newMessage]);
    
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputMessage })
      });
      const data = await response.json();
      
      const botMessage: Message = { role: 'bot', content: data.text || 'Thinking...' };
      setAgentChat(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const allMembers = [
    ...ecosystem.mentors,
    ...ecosystem.partners,
    ...ecosystem.serviceProviders,
    ...ecosystem.companies
  ];

  const filteredMembers = networkFilter === 'ALL' 
    ? allMembers 
    : allMembers.filter(m => m.type === networkFilter);

  if (role === 'NONE') {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <div className="w-16 h-16 bg-[#141414] rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-5xl font-medium font-serif italic mb-4 tracking-tight leading-tight">ZenBuild.</h1>
            <p className="text-[#141414]/50 mb-12 max-w-sm leading-relaxed text-lg">
              Automating ecosystem linkages for a programmable future. Choose your persona to enter the platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4">
            <LoginCard 
              title="Programme Administrator" 
              subtitle="Ecosystem Owner (Cradle)" 
              icon={<ShieldCheck size={28} />}
              onSelect={() => setRole('ADMIN')}
              description="Manage linkages, track program utilization, and coordinate ecosystem actors."
            />
            <LoginCard 
              title="Startup Founder" 
              subtitle="Participant / Venture" 
              icon={<Building2 size={28} />}
              onSelect={() => setRole('FOUNDER')}
              description="Discover mentors, apply to programmes, and access strategic service providers."
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-[#E9ECEF]">
      {/* Sidebar Navigation */}
      <nav className="fixed left-0 top-0 h-screen w-20 flex flex-col items-center py-8 bg-white border-r border-[#141414]/5 z-50 shadow-sm">
        <div className="mb-12 cursor-pointer" onClick={() => setRole('NONE')}>
           <div className="w-10 h-10 bg-[#141414] rounded-xl flex items-center justify-center text-white shadow-md">
              <ShieldCheck size={20} />
           </div>
        </div>
        
        <div className="flex-1 flex flex-col gap-6">
          {role === 'ADMIN' && (
            <>
              <NavItem icon={<Sparkles size={22} />} active={activeScreen === 'PROPOSAL_BUILDER'} onClick={() => setActiveScreen('PROPOSAL_BUILDER')} label="AI Programme Proposals" />
              <NavItem icon={<Wrench size={22} />} active={activeScreen === 'SP_ACTIVITY'} onClick={() => setActiveScreen('SP_ACTIVITY')} label="SP Activity Tracker" />
              <NavItem icon={<BarChart3 size={22} />} active={activeScreen === 'TRACKER'} onClick={() => setActiveScreen('TRACKER')} label="Admin Tracker" />
            </>
          )}
          {role === 'FOUNDER' && (
            <NavItem icon={<Layers size={22} />} active={activeScreen === 'FOUNDER_HUB'} onClick={() => setActiveScreen('FOUNDER_HUB')} label="Founder Hub" />
          )}
          <NavItem icon={<Search size={22} />} active={activeScreen === 'DISCOVERY'} onClick={() => setActiveScreen('DISCOVERY')} label="Discovery Library" />
          <NavItem icon={<Handshake size={22} />} active={activeScreen === 'NETWORK'} onClick={() => setActiveScreen('NETWORK')} label="Network List" />
          <NavItem icon={<Bot size={22} />} active={activeScreen === 'AGENT'} onClick={() => setActiveScreen('AGENT')} label="Ecosystem AI" />
        </div>

        <div className="mt-auto pb-4">
          <Button variant="ghost" size="icon" className="rounded-xl text-[#141414]/20 hover:text-[#141414]" onClick={() => setRole('NONE')}>
            <X size={20} />
          </Button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="ml-20 min-h-screen p-8 lg:p-12 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeScreen === 'FOUNDER_HUB' && role === 'FOUNDER' && (
            <motion.div 
              key="founder_hub"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto"
            >
               <h1 className="text-4xl font-medium font-serif italic mb-12 tracking-tight">Your Startup Hub.</h1>
               
               <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
                  <div className="flex flex-col gap-6">
                    <Card className="rounded-3xl border-[#141414]/5 bg-white p-8 text-center shadow-sm">
                      <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-[#F5F5F0]">
                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nabilah" />
                        <AvatarFallback>UN</AvatarFallback>
                      </Avatar>
                      <h2 className="text-xl font-medium">ZenPay Global</h2>
                      <p className="text-sm text-[#141414]/40 mb-6">Founder: Nabilah Abas</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#F5F5F0] p-4 rounded-2xl">
                          <p className="text-xs uppercase font-mono tracking-widest opacity-40 mb-1">Linkages</p>
                          <p className="text-lg font-medium">3</p>
                        </div>
                        <div className="bg-[#F5F5F0] p-4 rounded-2xl">
                          <p className="text-xs uppercase font-mono tracking-widest opacity-40 mb-1">Growth</p>
                          <p className="text-lg font-medium">A+</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="rounded-3xl border-[#141414]/5 bg-white p-6 shadow-sm">
                      <h3 className="text-sm uppercase font-mono tracking-widest opacity-40 mb-6">Active Programmes</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-[#F5F5F0] rounded-xl text-xs">
                          <span>Global Scaleup 2026</span>
                          <Badge className="bg-[#141414] text-white">ACTIVE</Badge>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <Card className="rounded-3xl border-[#141414]/5 bg-white p-8 shadow-sm">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-serif italic">Your Ecosystem Links</h3>
                        <Button variant="link" className="text-[#141414]/50">Verify Status</Button>
                      </div>
                      <div className="space-y-6">
                        {ecosystem.linkages.filter(l => l.target === 'c1').map((link: any) => {
                          const mentor = ecosystem.mentors.find((m: any) => m.id === link.source);
                          return (
                            <LinkageItem 
                              key={link.id} 
                              source={mentor?.name || 'Assigned Mentor'} 
                              target="ZenPay Global" 
                              type={link.type} 
                              status={link.status} 
                              strength={link.strength}
                            />
                          );
                        })}
                      </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <Card className="rounded-3xl border-none bg-[#141414] text-white p-8 relative overflow-hidden">
                          <div className="relative z-10">
                            <h3 className="text-2xl font-serif italic mb-2">Next Deliverable</h3>
                            <p className="opacity-60 mb-8 max-w-sm">Quarterly performance report for Cradle. Automated verification will be triggered tomorrow.</p>
                            <Button className="bg-white text-[#141414] rounded-2xl px-8 hover:bg-gray-200">Prepare Data</Button>
                          </div>
                          <Sparkles className="absolute -right-8 -bottom-8 w-40 h-40 opacity-10 rotate-12" />
                       </Card>
                       <Card className="rounded-3xl border-[#141414]/5 bg-white p-8 shadow-sm border border-[#141414]/5">
                          <h3 className="text-xl font-serif italic mb-4">Market Readiness</h3>
                          <div className="space-y-4">
                             <ProgressRow label="Technical Stability" value={92} />
                             <ProgressRow label="Market Traction" value={78} />
                             <ProgressRow label="Partnership Logic" value={65} />
                          </div>
                       </Card>
                    </div>
                  </div>
               </div>
            </motion.div>
          )}

          {activeScreen === 'SP_ACTIVITY' && role === 'ADMIN' && (
            <motion.div 
              key="sp_activity"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto"
            >
              <div className="mb-12">
                <h1 className="text-4xl font-medium font-serif italic mb-2 tracking-tight">Service Provider Activity.</h1>
                <p className="text-[#141414]/50 leading-relaxed max-w-2xl">
                  Real-time monitoring of vetted ecosystem specialists and their current engagement across stakeholders.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {ecosystem.serviceProviders.map(sp => (
                  <Card key={sp.id} className="rounded-3xl border-[#141414]/5 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-[#F8F9FA] rounded-2xl flex items-center justify-center">
                          <Wrench size={24} className="text-[#141414]/40" />
                        </div>
                        <Badge variant="outline" className={`font-mono text-[9px] px-2 py-0.5 ${sp.status === 'ACTIVE' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                          {sp.status}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-medium mb-1">{sp.name}</h3>
                      <p className="text-xs font-mono text-[#141414]/40 uppercase tracking-widest mb-6">{sp.expertise?.join(' • ')}</p>
                      
                      <div className="space-y-4">
                        <p className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-30">Current Engagements</p>
                        {sp.activeWork && sp.activeWork.length > 0 ? (
                          sp.activeWork.map((work, idx) => (
                            <div key={idx} className="bg-[#F8F9FA] rounded-2xl p-4 group">
                               <div className="flex justify-between items-start mb-2">
                                  <p className="text-xs font-semibold">{work.client}</p>
                                  <span className="text-[9px] font-mono text-green-600">{work.status}</span>
                               </div>
                               <p className="text-[11px] text-[#141414]/50 leading-relaxed">{work.task}</p>
                            </div>
                          ))
                        ) : (
                          <div className="py-8 text-center bg-[#F8F9FA] rounded-2xl border-2 border-dashed border-[#141414]/5">
                             <p className="text-xs text-[#141414]/30 font-mono italic uppercase tracking-widest">Available for Linkage</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {activeScreen === 'PROPOSAL_BUILDER' && role === 'ADMIN' && (
            <motion.div 
              key="proposal_builder"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-5xl mx-auto"
            >
              <div className="flex items-end justify-between mb-12">
                 <div>
                    <h1 className="text-4xl font-medium font-serif italic mb-2 tracking-tight">AI Programme Maker.</h1>
                    <p className="text-[#141414]/50 max-w-md">Gemini-driven programme assembly across mentors, mentees, and strategic support units.</p>
                 </div>
                 <Button variant="outline" className="rounded-2xl gap-2 font-mono text-[10px] uppercase tracking-widest px-6 h-12">
                    <Sparkles size={14} /> Generate New Proposal
                 </Button>
              </div>

              <div className="space-y-12">
                {(ecosystem.proposals || []).map(proposal => (
                  <Card key={proposal.id} className="rounded-[2.5rem] border-[#141414]/5 bg-white p-10 shadow-lg relative overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 relative z-10">
                       <div>
                          <div className="flex items-center gap-3 mb-6">
                             <Badge className="bg-[#141414] text-white px-4 py-1 rounded-full font-mono text-[9px] tracking-widest uppercase">PROPOSAL #{proposal.id}</Badge>
                             {proposal.status === 'APPROVED' && <Badge className="bg-green-100 text-green-700 border-none">APPROVED</Badge>}
                          </div>
                          <h2 className="text-3xl font-medium mb-4">{proposal.name}</h2>
                          <p className="text-[#141414]/60 bg-[#F8F9FA] p-6 rounded-3xl border-l-4 border-[#141414] mb-8 leading-relaxed italic">
                             "Logic: {proposal.logic}"
                          </p>
                          
                          <div className="grid grid-cols-2 gap-8 mb-10">
                             <div>
                                <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-30 mb-6">Suggested Mentees</h4>
                                <div className="flex -space-x-4">
                                   {proposal.suggestedCompanies.map(id => (
                                     <Avatar key={id} className="w-12 h-12 border-4 border-white bg-[#F5F5F0] flex items-center justify-center">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${id}`} />
                                     </Avatar>
                                   ))}
                                </div>
                             </div>
                             <div>
                                <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-30 mb-6">Suggested Mentors</h4>
                                <div className="flex -space-x-4">
                                   {proposal.suggestedMentors.map(id => (
                                     <Avatar key={id} className="w-12 h-12 border-4 border-white">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`} />
                                     </Avatar>
                                   ))}
                                </div>
                             </div>
                          </div>

                          <div className="flex items-center gap-4 py-6 border-t border-[#141414]/5">
                            <span className="text-[10px] font-mono uppercase tracking-widest opacity-30">Infra & Legal Mapping:</span>
                            {proposal.suggestedPartners.map(p => <Badge key={p} variant="secondary" className="bg-[#F8F9FA] text-[10px]">{p}</Badge>)}
                            {proposal.suggestedProviders.map(sp => <Badge key={sp} variant="secondary" className="bg-[#F8F9FA] text-[10px]">{sp}</Badge>)}
                          </div>
                       </div>

                       <div className="flex flex-col justify-center gap-4 bg-[#F8F9FA] p-8 rounded-3xl border border-[#141414]/5">
                          <p className="text-center text-xs text-[#141414]/40 font-mono uppercase tracking-widest mb-4">Admin Governance</p>
                          <Button 
                            className="bg-[#141414] text-white rounded-2xl h-14 w-full shadow-lg hover:scale-[1.02] transition-transform flex items-center gap-2"
                            onClick={() => {
                               setEcosystem(prev => ({
                                  ...prev,
                                  proposals: prev.proposals.map(p => p.id === proposal.id ? { ...p, status: 'APPROVED' } : p)
                               }));
                            }}
                          >
                             Approve Suggestion <CheckCircle2 size={18} />
                          </Button>
                          <Button 
                            variant="outline" 
                            className="rounded-2xl h-14 w-full border-[#141414]/10 text-[#141414] hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all flex items-center gap-2"
                            onClick={() => {
                               setEcosystem(prev => ({
                                  ...prev,
                                  proposals: prev.proposals.map(p => p.id === proposal.id ? { ...p, status: 'DISMISSED' } : p)
                               }));
                            }}
                          >
                             Reject Structure <X size={18} />
                          </Button>
                       </div>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#F8F9FA] rounded-bl-[4rem] flex items-center justify-center">
                       <Bot size={48} className="text-[#141414]/10" />
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}


          {activeScreen === 'DISCOVERY' && (
            <motion.div 
              key="discovery"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto"
            >
              <div className="mb-12">
                <h1 className="text-4xl font-medium font-serif italic mb-2">Discovery Library</h1>
                <p className="text-[#141414]/50">Browse reusable ecosystem entities and programmes.</p>
              </div>

              <div className="space-y-16">
                <section>
                  <SectionHeader title="Programmes" icon={<Layers size={20}/>} subtitle="Active and upcoming initiatives" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {ecosystem.programs.map((p) => (
                      <Card key={p.id} className="rounded-2xl border-[#141414]/5 shadow-sm overflow-hidden flex flex-col h-full">
                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex justify-between items-start mb-4">
                            <Badge className={`${p.status === 'ONGOING' ? 'bg-green-100 text-green-700' : p.status === 'REGISTERING' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'} border-none px-3 py-1 font-mono text-[10px]`}>
                              {p.status}
                            </Badge>
                            <Clock size={16} className="opacity-20" />
                          </div>
                          <h3 className="text-xl font-medium mb-2">{p.name}</h3>
                          <p className="text-sm text-[#141414]/50 mb-6 leading-relaxed flex-1">{p.description || 'Verified programme track.'}</p>
                          <div className="mt-auto">
                            <Button variant="outline" className="w-full rounded-xl border-[#141414]/10 text-xs font-mono uppercase tracking-widest text-[#141414]">
                              {p.status === 'REGISTERING' ? 'Apply Now' : 'View Cohort'}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                   <section>
                    <SectionHeader title="Strategic Partners" icon={<Handshake size={20}/>} subtitle="Resource and infrastructure support" />
                    <div className="grid grid-cols-1 gap-4">
                       {ecosystem.partners.map(p => (
                         <DiscoveryItem key={p.id} item={p} />
                       ))}
                    </div>
                  </section>
                  <section>
                    <SectionHeader title="Service Providers" icon={<Wrench size={20}/>} subtitle="Vetted scaling specialists" />
                    <div className="grid grid-cols-1 gap-4">
                       {ecosystem.serviceProviders.map(p => (
                         <DiscoveryItem key={p.id} item={p} />
                       ))}
                    </div>
                  </section>
                </div>
              </div>
            </motion.div>
          )}

          {activeScreen === 'TRACKER' && role === 'ADMIN' && (
            <motion.div 
              key="tracker"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto"
            >
              <div className="flex items-center justify-between mb-12">
                 <div>
                    <h1 className="text-3xl font-medium font-serif italic mb-1">Admin Tracker</h1>
                    <p className="text-sm text-[#141414]/40 flex items-center gap-2">
                       <ShieldCheck size={14} /> Ecosystem Administrator View (Cradle)
                    </p>
                 </div>
                 <Badge variant="outline" className="font-mono text-green-600 bg-green-50 border-green-100 px-4 py-1.5 rounded-full">
                    AUTOMATED COORDINATION: ON
                 </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatsCard title="Total Participant Entities" value={allMembers.length} trend="+12% this month" />
                <StatsCard title="Reusable Linkages" value={ecosystem.linkages.length} trend="85% strength avg." />
                <StatsCard title="Program Utilization" value="92%" trend="Across 3 regions" />
              </div>

              <Card className="rounded-3xl border-[#141414]/5 bg-white p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-medium">Company Ecosystem Tracker</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-lg text-[#141414] text-[10px] font-mono h-8">DOWNLOAD TAX REPORTS</Button>
                    <Button variant="outline" size="sm" className="rounded-lg text-[#141414] text-[10px] font-mono h-8">AUDIT ALL</Button>
                  </div>
                </div>
                <div className="space-y-4">
                   <div className="grid grid-cols-[1fr_120px_150px_100px_40px] gap-4 px-4 py-2 bg-[#F8F9FA] rounded-xl text-[9px] font-mono uppercase tracking-[0.2em] opacity-40">
                      <span>Company Entity</span>
                      <span>Ecosystem Score</span>
                      <span className="text-center">Compliance Status</span>
                      <span>Audit Date</span>
                      <span></span>
                   </div>
                   {ecosystem.companies.map((company) => (
                      <div key={company.id} className="grid grid-cols-[1fr_120px_150px_100px_40px] gap-4 items-center px-4 py-6 border-b border-[#141414]/5 last:border-none hover:bg-[#F8F9FA]/50 transition-all rounded-2xl group">
                         <div className="flex items-center gap-4">
                            <Avatar className="w-10 h-10 rounded-xl">
                               <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${company.id}`} />
                            </Avatar>
                            <div>
                               <p className="font-medium text-sm">{company.name}</p>
                               <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[9px] font-mono opacity-40">{company.industry}</span>
                                  <span className="text-[9px] font-mono opacity-20">•</span>
                                  <span className="text-[9px] font-mono opacity-40">{company.stage}</span>
                               </div>
                            </div>
                         </div>

                         <div>
                            <div className="flex items-center gap-3">
                               <div className="flex-1 h-1.5 bg-[#141414]/5 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${company.score || 0}%` }}
                                    className="h-full bg-[#141414]" 
                                  />
                               </div>
                               <span className="text-xs font-mono font-bold">{(company.score || 0)}%</span>
                            </div>
                         </div>

                         <div className="flex justify-center gap-1.5">
                            {company.compliance && (
                               <>
                                  <Badge variant="outline" className={`text-[8px] px-1.5 py-0 rounded-sm border-none ${company.compliance.ssm === 'VERIFIED' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>SSM</Badge>
                                  <Badge variant="outline" className={`text-[8px] px-1.5 py-0 rounded-sm border-none ${company.compliance.bnm === 'CLEARED' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>BNM</Badge>
                                  <Badge variant="outline" className={`text-[8px] px-1.5 py-0 rounded-sm border-none ${company.compliance.lhdn === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>LHDN</Badge>
                               </>
                            )}
                         </div>

                         <div className="text-right">
                            <p className="text-[10px] font-mono opacity-40">{company.compliance?.lastAuditDate || 'N/A'}</p>
                         </div>

                         <div className="flex justify-end">
                            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-[#141414]/20 group-hover:text-[#141414] group-hover:bg-white shadow-sm transition-all">
                               <ChevronRight size={14} />
                            </Button>
                         </div>
                      </div>
                   ))}
                </div>
              </Card>
            </motion.div>
          )}

          {activeScreen === 'NETWORK' && (
            <motion.div 
              key="network"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto"
            >
              <div className="flex items-end justify-between mb-12">
                <div>
                  <h1 className="text-4xl font-medium font-serif italic mb-2">Ecosystem Network</h1>
                  <p className="text-[#141414]/50">A structured verification of all ecosystem actors.</p>
                </div>
                <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-[#141414]/5">
                  <FilterToggle label="All" active={networkFilter === 'ALL'} onClick={() => setNetworkFilter('ALL')} />
                  <FilterToggle label="Mentors" active={networkFilter === 'MENTOR'} onClick={() => setNetworkFilter('MENTOR')} />
                  <FilterToggle label="Partners" active={networkFilter === 'PARTNER'} onClick={() => setNetworkFilter('PARTNER')} />
                  <FilterToggle label="Providers" active={networkFilter === 'SERVICE_PROVIDER'} onClick={() => setNetworkFilter('SERVICE_PROVIDER')} />
                  <FilterToggle label="Companies" active={networkFilter === 'COMPANY'} onClick={() => setNetworkFilter('COMPANY')} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {filteredMembers.map(member => (
                   <FlippableMemberCard key={member.id} member={member} />
                 ))}
              </div>
            </motion.div>
          )}

          {activeScreen === 'AGENT' && (
            <motion.div 
               key="agent"
               initial={{ opacity: 0, scale: 1.02 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0 }}
               className="max-w-4xl mx-auto h-[85vh] flex flex-col pt-8"
            >
               <div className="text-center mb-10">
                  <div className="w-20 h-20 bg-[#141414] rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-2xl">
                    <Bot size={40} />
                  </div>
                  <h1 className="text-4xl font-medium font-serif italic tracking-tight mb-2">Ecosystem AI Coordinator.</h1>
                  <p className="text-[#141414]/50 max-w-sm mx-auto">Automating relationships and managing system linkages as programmable entities.</p>
               </div>

               <div className="flex-1 bg-white rounded-3xl border border-[#141414]/5 flex flex-col shadow-sm overflow-hidden mb-8">
                  <ScrollArea className="flex-1 p-8">
                    <div className="space-y-8 max-w-2xl mx-auto">
                       {agentChat.length === 0 && (
                         <div className="grid grid-cols-2 gap-4 mt-8">
                           <PromptSuggestion text="Verify latest linkages" icon={<CheckCircle2 size={14}/>} />
                           <PromptSuggestion text="Match Alex with a company" icon={<Handshake size={14}/>} />
                           <PromptSuggestion text="Show program utilization" icon={<BarChart3 size={14}/>} />
                           <PromptSuggestion text="Explain programmable units" icon={< Bot size={14}/>} />
                         </div>
                       )}
                       {agentChat.map((msg, i) => (
                         <div key={i} className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 opacity-30 uppercase font-mono text-[10px] tracking-widest pl-1">
                               {msg.role === 'bot' ? 'Coordinator AI' : 'Admin'}
                            </div>
                            <div className={`p-4 rounded-3xl ${msg.role === 'bot' ? 'bg-[#F8F9FA]' : 'bg-[#141414] text-white'}`}>
                               <p className="text-sm leading-relaxed">{msg.content}</p>
                            </div>
                         </div>
                       ))}
                       {isLoading && (
                         <div className="flex gap-2 p-4 bg-[#F8F9FA] rounded-2xl w-20 justify-center">
                           <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1 h-1 rounded-full bg-[#141414]" />
                           <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1 h-1 rounded-full bg-[#141414]" />
                           <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1 h-1 rounded-full bg-[#141414]" />
                         </div>
                       )}
                    </div>
                  </ScrollArea>

                  <div className="p-8 border-t border-[#141414]/5 bg-white">
                    <div className="relative max-w-2xl mx-auto">
                      <Input 
                        placeholder="Talk to the ecosystem coordinator..." 
                        className="pr-16 h-14 rounded-2xl bg-[#F8F9FA] border-none shadow-inner"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <Button 
                         className="absolute right-2 top-2 h-10 w-10 p-0 rounded-xl bg-[#141414] text-white hover:bg-[#333]"
                         onClick={() => handleSendMessage()}
                      >
                         <ChevronRight size={18} />
                      </Button>
                    </div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function LoginCard({ title, subtitle, icon, onSelect, description }: { title: string; subtitle: string; icon: React.ReactNode; onSelect: () => void; description: string }) {
  return (
    <Card className="rounded-3xl border-[#141414]/5 bg-white p-8 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group" onClick={onSelect}>
      <div className="flex items-start gap-6">
        <div className="w-16 h-16 bg-[#F8F9FA] rounded-2xl flex items-center justify-center text-[#141414] group-hover:bg-[#141414] group-hover:text-white transition-all shadow-inner">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-medium mb-1">{title}</h3>
          <p className="text-[10px] font-mono tracking-widest uppercase opacity-40 mb-4">{subtitle}</p>
          <p className="text-sm text-[#141414]/50 leading-relaxed mb-6">{description}</p>
          <div className="flex items-center gap-2 text-xs font-medium text-[#141414] group-hover:translate-x-2 transition-transform">
            Enter Dashboard <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Card>
  );
}

function NavItem({ icon, active, onClick, label }: { icon: React.ReactNode; active: boolean; onClick: () => void; label: string }) {
  return (
    <div 
      className={`group relative cursor-pointer flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
        active ? 'bg-[#141414] text-white shadow-lg scale-110' : 'text-[#141414]/30 hover:text-[#141414] hover:bg-white border border-transparent hover:border-[#141414]/5'
      }`}
      onClick={onClick}
    >
      {icon}
      <div className="absolute left-16 px-2 py-1 bg-[#141414] text-white text-[10px] uppercase font-mono tracking-widest rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[100] shadow-xl">
        {label}
      </div>
    </div>
  );
}


function SectionHeader({ title, icon, subtitle }: { title: string, icon: React.ReactNode, subtitle: string }) {
  return (
    <div className="mb-8">
       <div className="flex items-center gap-3 mb-1">
          <div className="text-[#141414]">{icon}</div>
          <h2 className="text-2xl font-medium italic font-serif">{title}</h2>
       </div>
       <p className="text-sm text-[#141414]/40">{subtitle}</p>
    </div>
  );
}

function DiscoveryItem({ item }: { item: Member; key?: React.Key }) {
  return (
    <Card className="rounded-2xl border-[#141414]/5 bg-white p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group">
       <div className="flex items-start gap-5">
          <Avatar className="w-14 h-14 rounded-xl">
             <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${item.id}`} />
          </Avatar>
          <div className="flex-1">
             <div className="flex justify-between items-start mb-1">
                <h4 className="font-medium">{item.name}</h4>
                <Badge variant="outline" className="text-[8px] font-mono tracking-[0.2em]">{item.type.replace('_', ' ')}</Badge>
             </div>
             <p className="text-xs text-[#141414]/60 line-clamp-1 mb-4">{item.bio}</p>
             <div className="flex gap-4">
                {item.expertise?.slice(0, 2).map(skill => (
                  <span key={skill} className="text-[10px] font-mono text-[#141414]/40">{skill}</span>
                ))}
             </div>
          </div>
          <ChevronRight size={16} className="text-[#141414]/10 group-hover:text-[#141414] transition-colors" />
       </div>
    </Card>
  );
}

function FlippableMemberCard({ member }: { member: Member; key?: React.Key }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative w-full h-[400px] perspective-1000 group cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Front Face */}
        <div className="absolute inset-0 backface-hidden">
          <Card className="w-full h-full rounded-3xl border-[#141414]/5 bg-white shadow-sm flex flex-col">
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <Avatar className="w-14 h-14 rounded-2xl">
                  <AvatarImage src={member.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${member.id}`} />
                </Avatar>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="outline" className={`text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-md ${
                    member.type === 'MENTOR' ? 'text-purple-600 border-purple-100 bg-purple-50' :
                    member.type === 'PARTNER' ? 'text-blue-600 border-blue-100 bg-blue-50' :
                    member.type === 'SERVICE_PROVIDER' ? 'text-orange-600 border-orange-100 bg-orange-50' :
                    'text-emerald-600 border-emerald-100 bg-emerald-50'
                  }`}>
                    {member.type.replace('_', ' ')}
                  </Badge>
                  {member.score !== undefined && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 h-1 bg-[#141414]/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#141414]" 
                          style={{ width: `${member.score}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-mono font-bold">{member.score}%</span>
                    </div>
                  )}
                </div>
              </div>
              <h3 className="text-xl font-medium mb-1">{member.name}</h3>
              <p className="text-xs text-[#141414]/40 uppercase tracking-widest font-mono mb-4">{member.role || member.stage || 'Strategic Member'}</p>
              <p className="text-sm text-[#141414]/60 line-clamp-3 leading-relaxed mb-6">
                {member.bio || member.description || `Verified ecosystem member since 2025 focusing on ${member.industry || 'innovation'}.`}
              </p>
              <div className="mt-auto">
                <div className="flex flex-wrap gap-2">
                  {(member.expertise || []).slice(0, 3).map(skill => (
                    <span key={skill} className="text-[10px] text-[#141414]/40 border-b border-[#141414]/5 pb-0.5">{skill}</span>
                  ))}
                </div>
                <p className="text-[9px] font-mono uppercase tracking-widest text-[#141414]/20 mt-4 text-center">Tap to flip</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <Card className="w-full h-full rounded-3xl border-[#141414]/10 bg-[#141414] text-white p-6 flex flex-col shadow-2xl">
            <div className="flex flex-col h-full">
              <h3 className="text-xl font-medium mb-1">{member.name}</h3>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-40 mb-8">Ecosystem Value Stack</p>
              
              <div className="space-y-6 flex-1">
                {member.values && member.values.length > 0 && (
                  <div>
                    <h4 className="text-[9px] font-mono uppercase tracking-widest opacity-30 mb-3">Core Values</h4>
                    <div className="space-y-2">
                       {member.values.map(val => (
                         <div key={val} className="flex items-center gap-2">
                            <CheckCircle2 size={12} className="text-green-400" />
                            <span className="text-xs tracking-tight">{val}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-[9px] font-mono uppercase tracking-widest opacity-30 mb-3">Extended Expertise</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {member.expertise?.map(skill => (
                      <Badge key={skill} variant="outline" className="bg-white/5 border-white/10 text-white text-[9px] font-normal rounded-lg">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {member.compliance && (
                  <div className="pt-4 border-t border-white/5">
                    <h4 className="text-[9px] font-mono uppercase tracking-widest opacity-30 mb-3">Regulatory Compliance (Admin View)</h4>
                    <div className="grid grid-cols-3 gap-2">
                       <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex flex-col items-center">
                          <span className="text-[8px] font-mono opacity-40 mb-1">SSM</span>
                          <span className={`text-[9px] font-bold ${member.compliance.ssm === 'VERIFIED' ? 'text-green-400' : 'text-yellow-400'}`}>{member.compliance.ssm}</span>
                       </div>
                       <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex flex-col items-center">
                          <span className="text-[8px] font-mono opacity-40 mb-1">BNM</span>
                          <span className={`text-[9px] font-bold ${member.compliance.bnm === 'CLEARED' ? 'text-green-400' : 'text-orange-400'}`}>{member.compliance.bnm}</span>
                       </div>
                       <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex flex-col items-center">
                          <span className="text-[8px] font-mono opacity-40 mb-1">LHDN</span>
                          <span className={`text-[9px] font-bold ${member.compliance.lhdn === 'ACTIVE' ? 'text-green-400' : 'text-red-400'}`}>{member.compliance.lhdn}</span>
                       </div>
                    </div>
                    <p className="text-[8px] font-mono opacity-20 mt-2 text-right">LAST AUDIT: {member.compliance.lastAuditDate}</p>
                  </div>
                )}

                {member.industry && (
                   <div>
                      <h4 className="text-[9px] font-mono uppercase tracking-widest opacity-30 mb-2">Primary Domain</h4>
                      <p className="text-sm font-medium">{member.industry}</p>
                   </div>
                )}
              </div>

              <div className="mt-auto pt-6 border-t border-white/10">
                <Button className="w-full bg-white text-[#141414] rounded-xl text-xs font-mono uppercase tracking-widest h-10 hover:bg-gray-200">
                  Request Connection
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}

function StatsCard({ title, value, trend }: { title: string, value: string | number, trend: string }) {
  return (
    <Card className="rounded-3xl border-[#141414]/5 bg-white p-6 shadow-sm">
       <p className="text-[10px] font-mono uppercase tracking-widest text-[#141414]/40 mb-2">{title}</p>
       <div className="flex items-end gap-3">
          <p className="text-3xl font-medium tracking-tight">{value}</p>
          <p className="text-xs text-green-600 mb-1">{trend}</p>
       </div>
    </Card>
  );
}

function FilterToggle({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-[10px] font-mono uppercase tracking-widest transition-all ${
        active ? 'bg-[#141414] text-white shadow-lg' : 'text-[#141414]/40 hover:text-[#141414] hover:bg-[#F8F9FA]'
      }`}
    >
      {label}
    </button>
  );
}

function PromptSuggestion({ text, icon }: { text: string, icon: React.ReactNode }) {
  return (
    <div className="p-4 bg-white border border-[#141414]/5 rounded-2xl flex items-center gap-3 hover:bg-[#F8F9FA] hover:border-[#141414]/10 transition-all cursor-pointer group">
       <div className="w-8 h-8 rounded-lg bg-[#F8F9FA] group-hover:bg-white flex items-center justify-center text-[#141414]/40 transition-all transition-colors shadow-sm">
          {icon}
       </div>
       <span className="text-[11px] font-medium tracking-tight">{text}</span>
    </div>
  );
}

function ProgressRow({ label, value }: { label: string, value: number }) {
  return (
    <div className="space-y-1.5">
       <div className="flex justify-between text-[10px] uppercase font-mono text-[#141414]/40 tracking-wider">
          <span>{label}</span>
          <span>{value}%</span>
       </div>
       <div className="w-full h-1 bg-[#F5F5F0] rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-[#141414]" 
          />
       </div>
    </div>
  );
}

function LinkageItem({ source, target, type, status, strength }: { source: string; target: string; type: string; status: string; strength: number; key?: React.Key }) {
  return (
    <div className="group flex items-center gap-6 p-5 rounded-2xl border border-transparent hover:border-[#141414]/5 hover:bg-[#F5F5F0] transition-all cursor-pointer">
      <div className="flex flex-col items-center">
         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-[#141414]/40 border border-[#141414]/5">
            <Users size={18} />
         </div>
      </div>
      
      <div className="flex-1 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm">{source} <span className="mx-2 opacity-20">→</span> {target}</h4>
            <Badge variant="outline" className={`text-[8px] uppercase tracking-widest ${status === 'VERIFIED' ? 'bg-blue-50' : 'bg-green-50'}`}>{status}</Badge>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-[#141414]/40 uppercase tracking-widest">
            <span>{type.replace('_', ' ')}</span>
            <span>Link Strength: {strength}%</span>
          </div>
        </div>
      </div>
      
      <div className="w-1.5 h-10 bg-[#F5F5F0] rounded-full overflow-hidden">
         <div className="w-full bg-[#141414]" style={{ height: `${strength}%` }} />
      </div>
    </div>
  );
}
