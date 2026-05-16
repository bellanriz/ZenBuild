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
  ChevronLeft,
  ExternalLink,
  ArrowLeft,
  Activity,
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
  Target,
  Shield,
  Circle
} from 'lucide-react';

const SyncraLogo = ({ size = 32, className = "" }: { size?: number; className?: string }) => (
  <motion.svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    className={className}
    initial="initial"
    animate="animate"
  >
    <motion.circle 
      cx="35" 
      cy="50" 
      r="30" 
      fill="currentColor"
      variants={{
        initial: { scale: 0.5, opacity: 0, x: -10 },
        animate: { 
          scale: 1, 
          opacity: 1, 
          x: 0,
          transition: { 
            duration: 0.8, 
            ease: [0.16, 1, 0.3, 1] 
          } 
        }
      }}
    />
    <motion.path 
      d="M 68 20 A 30 30 0 0 1 68 80 Z" 
      fill="currentColor"
      variants={{
        initial: { x: 20, opacity: 0, scale: 0.8 },
        animate: { 
          x: 0, 
          opacity: 1, 
          scale: 1,
          transition: { 
            delay: 0.2, 
            duration: 0.9, 
            type: "spring", 
            bounce: 0.4 
          } 
        }
      }}
    />
  </motion.svg>
);
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
  analystInsights?: Array<{ id: string; title: string; insight: string; impact: string }>;
}

interface Message {
  role: 'user' | 'bot';
  content: string;
}

export default function App() {
  const [role, setRole] = useState<UserRole>('NONE');
  const [activeScreen, setActiveScreen] = useState<Screen>('DISCOVERY');
  const [ecosystem, setEcosystem] = useState<EcosystemData>({ mentors: [], companies: [], partners: [], serviceProviders: [], programs: [], linkages: [] });
  const [agentChat, setAgentChat] = useState<Message[]>([
    { role: 'bot', content: 'Syncra IQ Core activated. Monitoring ecosystem nodes. How can I assist with your linkage strategy?' }
  ]);
  const [adminFounderChat, setAdminFounderChat] = useState<Message[]>([
    { role: 'bot', content: 'Direct Linkage Channel established. This is a secure channel between Programme Admin and Founder Hub.' }
  ]);
  const [activeAgentTab, setActiveAgentTab] = useState<'AI_AGENT' | 'DIRECT_LINKAGE'>('AI_AGENT');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [nodeChats, setNodeChats] = useState<Record<string, Message[]>>({});
  const [inputMessage, setInputMessage] = useState('');
  const [nodeMatches, setNodeMatches] = useState<any[]>([]);

  const handleInputChange = (val: string) => {
    setInputMessage(val);
    if (val.length > 1) {
      const allNodes = [...ecosystem.mentors, ...ecosystem.partners, ...ecosystem.serviceProviders];
      const matches = allNodes.filter(n => n.name.toLowerCase().includes(val.toLowerCase())).slice(0, 3);
      setNodeMatches(matches);
    } else {
      setNodeMatches([]);
    }
  };

  const selectNodeMatch = (name: string) => {
    setInputMessage(`@${name} `);
    setNodeMatches([]);
  };
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeScreen === 'AGENT') {
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    }
  }, [agentChat, adminFounderChat, nodeChats, selectedNodeId, activeAgentTab, activeScreen]);

  const [networkFilter, setNetworkFilter] = useState<string>('ALL');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [showFullAuditReport, setShowFullAuditReport] = useState(false);
  const [activeAuditType, setActiveAuditType] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilationProgress, setCompilationProgress] = useState(0);
  const [reportsReady, setReportsReady] = useState(false);
  const [isGeneratingAudit, setIsGeneratingAudit] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);

  const selectedCompany = ecosystem.companies.find(c => c.id === selectedCompanyId);

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

  const handleSendMessage = async (msgOverride?: string) => {
    const messageToUse = msgOverride || inputMessage;
    if (!messageToUse.trim()) return;

    const newMessage: Message = { role: 'user', content: messageToUse };
    
    if (activeAgentTab === 'AI_AGENT') {
      setAgentChat(prev => [...prev, newMessage]);
      if (!msgOverride) setInputMessage('');
      setIsLoading(true);

      try {
        const response = await fetch('/api/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: messageToUse })
        });
        const data = await response.json();
        
        const botResponse: Message = { 
          role: 'bot', 
          content: data.text || `Analyzing "${messageToUse}" against ecosystem risk matrices. Linkage optimization in progress...` 
        };
        setAgentChat(prev => [...prev, botResponse]);
      } catch (err) {
        console.error("AI Agent error", err);
        const botResponse: Message = { 
          role: 'bot', 
          content: "Ecosystem node transient error. Retrying neural linkage..." 
        };
        setAgentChat(prev => [...prev, botResponse]);
      } finally {
        setIsLoading(false);
      }
    } else {
      if (selectedNodeId) {
        setNodeChats(prev => ({
          ...prev,
          [selectedNodeId]: [...(prev[selectedNodeId] || []), newMessage]
        }));
        setInputMessage('');
        
        setTimeout(() => {
          const selectedNode = [...ecosystem.mentors, ...ecosystem.partners, ...ecosystem.serviceProviders].find(n => n.id === selectedNodeId);
          const botResponse: Message = { 
            role: 'bot', 
            content: `Hello! This is ${selectedNode?.name || 'an Ecosystem Node'}. I've received your message and will review it to see how we can best collaborate within the Syncra ecosystem.` 
          };
          setNodeChats(prev => ({
            ...prev,
            [selectedNodeId]: [...(prev[selectedNodeId] || []), botResponse]
          }));
        }, 1200);
      } else {
        setAdminFounderChat(prev => [...prev, newMessage]);
        setInputMessage('');
        
        // Simulate response for Direct Linkage
        setTimeout(() => {
          const responderName = role === 'ADMIN' ? 'Founder Response' : 'Admin Response';
          const botResponse: Message = { 
            role: 'bot', 
            content: `Acknowledged. Relaying your inquiry to ${role === 'ADMIN' ? 'the Founder Hub' : 'Programme Administration'}. Expect a resolution update shortly.` 
          };
          setAdminFounderChat(prev => [...prev, botResponse]);
        }, 1200);
      }
    }
  };

  const handleApplyNow = (programName: string) => {
    setActiveScreen('AGENT');
    setActiveAgentTab('AI_AGENT');
    handleSendMessage(`I want to Apply for ${programName}. Please automate the required documentation, compliance verification, and ecosystem linkage for my venture.`);
  };

  const runAiGovernanceEngine = () => {
    setIsCompiling(true);
    setCompilationProgress(0);
    setReportsReady(false);
    
    // Simulate complex data analysis
    const interval = setInterval(() => {
      setCompilationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsCompiling(false);
            setReportsReady(true);
            // Switch to admin view automatically to see the results
            // Note: In real app, this would be a transition
          }, 800);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
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
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 lg:p-12">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-24 h-24 bg-brand-dark rounded-[2rem] flex items-center justify-center text-brand-yellow mb-10 shadow-2xl relative"
            >
              <SyncraLogo size={60} />
              <div className="absolute -inset-4 bg-brand-yellow/5 rounded-[2.5rem] animate-pulse -z-10" />
            </motion.div>
            <h1 className="text-7xl font-bold tracking-tighter mb-6 leading-[0.9]">
              Syncra. <br/>
              <span className="text-brand-yellow italic font-medium">Ecosystem Intelligence.</span>
            </h1>
            <p className="text-brand-dark opacity-50 mb-10 max-w-sm leading-relaxed text-lg font-medium text-balance">
              The command center for Cradle's programmable linkages and automated regulatory units.
            </p>
            <div className="flex gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <Avatar key={i} className="w-10 h-10 border-4 border-brand-bg rounded-full">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} />
                  </Avatar>
                ))}
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40">Trusted by</p>
                <p className="text-xs font-bold text-brand-dark">1,200+ Ecosystem Entities</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-6">
            <LoginCard 
              title="Programme Administrator" 
              subtitle="Cradle Dashboard" 
              onSelect={() => setRole('ADMIN')}
              icon={<SyncraLogo size={36} />}
              description="Monitor compliance, track program velocity, and manage regulatory linkages across the ecosystem."
            />
            <LoginCard 
              title="Startup Founder" 
              subtitle="Participant / Venture" 
              onSelect={() => setRole('FOUNDER')}
              icon={<Building2 size={32} />}
              description="Access the founder hub, view compliance reports, and request strategic mentorship linkages."
            />
          </div>
        </div>
      </div>
    );
  }

  const triggerAuditGeneration = (type: string) => {
    setIsGeneratingAudit(true);
    setAuditProgress(0);
    setActiveAuditType(type);
    const interval = setInterval(() => {
      setAuditProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsGeneratingAudit(false);
            setShowFullAuditReport(true);
          }, 500);
          return 100;
        }
        return p + 5;
      });
    }, 40);
  };

  if (isGeneratingAudit) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-6 text-white overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="relative w-40 h-40 mx-auto mb-16">
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 border-t-2 border-brand-yellow rounded-full"
             />
             <motion.div 
               animate={{ rotate: -360 }}
               transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
               className="absolute inset-4 border-b-2 border-brand-yellow/20 rounded-full"
             />
             <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="text-brand-yellow animate-pulse" size={48} />
             </div>
          </div>
          
          <h2 className="text-4xl font-bold tracking-tight mb-4 text-brand-yellow">{activeAuditType === 'Mentor Performance' ? 'Synthesizing Mentor Analysis' : 'Synthesizing Audit Data'}</h2>
          <p className="text-white/40 font-mono text-[10px] tracking-[0.3em] uppercase mb-12">{activeAuditType === 'Mentor Performance' ? 'Mentor Performance Analysis in Progress' : 'Ecosystem Analysis in Progress'}</p>
          
          <div className="space-y-6">
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 className="h-full bg-brand-yellow"
                 animate={{ width: `${auditProgress}%` }}
               />
            </div>
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-brand-yellow/60">
               <span>{activeAuditType === 'Mentor Performance' 
                 ? (auditProgress < 30 ? 'GATHERING MENTOR DATA' : auditProgress < 60 ? 'ANALYZING PERFORMANCE' : auditProgress < 90 ? 'SCORING IMPACT' : 'FINALIZING ANALYSIS')
                 : (auditProgress < 30 ? 'SSM INDEXING' : auditProgress < 60 ? 'BNM FORENSICS' : auditProgress < 90 ? 'LHDN RECONCILIATION' : 'FINALIZING REPORT')
               }</span>
               <span className="text-brand-yellow">{auditProgress}%</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (showFullAuditReport) {
    return (
      <div className="min-h-screen bg-brand-bg font-sans selection:bg-brand-dark selection:text-white pb-20">
        <div className="max-w-7xl mx-auto px-6 pt-12">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Button 
              variant="ghost" 
              onClick={() => {
                setShowFullAuditReport(false);
                setActiveAuditType(null);
              }}
              className="group -ml-4 mb-20 text-brand-dark/40 hover:text-brand-dark transition-all font-bold text-xs uppercase tracking-widest"
            >
              <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-2 transition-transform" />
              BACK TO GOVERNANCE HUB
            </Button>

            {activeAuditType === 'Compliance Trend' && <ComplianceAuditReport ecosystem={ecosystem} />}
            {activeAuditType === 'Scale-up Velocity' && <VelocityAuditReport ecosystem={ecosystem} />}
            {activeAuditType === 'Risk Alert' && <RiskAuditReport ecosystem={ecosystem} />}
            {activeAuditType === 'Mentor Performance' && <MentorAnalystReport ecosystem={ecosystem} />}
            {!activeAuditType && <DefaultAuditReport ecosystem={ecosystem} />}
            
          </motion.div>
        </div>
      </div>
    );
  }

  if (selectedCompanyId && selectedCompany) {
    return (
      <div className="min-h-screen bg-brand-bg font-sans selection:bg-brand-dark selection:text-white pb-20">
        <div className="max-w-7xl mx-auto px-6 pt-12">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Button 
              variant="ghost" 
              onClick={() => setSelectedCompanyId(null)}
              className="group -ml-4 mb-12 text-brand-dark/40 hover:text-brand-dark transition-all font-bold text-xs uppercase tracking-widest"
            >
              <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-2 transition-transform" />
              BACK TO ECOSYSTEM DIRECTORY
            </Button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
               <div className="flex items-center gap-10">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-white shadow-2xl border-none flex items-center justify-center overflow-hidden shrink-0 border-4 border-white">
                     <Avatar className="w-full h-full rounded-none">
                        <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${selectedCompany.id}`} />
                     </Avatar>
                  </div>
                  <div>
                    <div className="flex items-center gap-4 mb-3">
                       <h1 className="text-5xl font-bold tracking-tight">{selectedCompany.name}</h1>
                       <Badge className="bg-brand-yellow text-brand-dark border-none uppercase font-bold text-[10px] tracking-widest px-4 py-1.5 rounded-full shadow-sm">{selectedCompany.stage}</Badge>
                    </div>
                    <p className="text-brand-dark/40 text-xl font-medium tracking-tight">{selectedCompany.industry} • Verified Node</p>
                  </div>
               </div>
               <div className="flex gap-4 w-full md:w-auto">
                  <Button className="flex-1 md:flex-none bg-brand-dark text-brand-yellow rounded-full px-12 h-14 text-sm font-bold uppercase tracking-widest shadow-xl shadow-brand-dark/10">Request Audit</Button>
                  <Button variant="outline" className="rounded-full h-14 w-14 border-brand-dark/10 text-brand-dark hover:bg-white"><ExternalLink size={20}/></Button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
               <div className="lg:col-span-2 space-y-10">
                  <Card className="rounded-[2.2rem] border-none bg-white p-10 shadow-sm relative overflow-hidden">
                     <h3 className="text-xl font-bold mb-6 tracking-tight">Venture DNA</h3>
                     <p className="text-brand-dark/60 leading-relaxed mb-8 text-base font-medium relative z-10">
                        {selectedCompany.bio || `Verified ecosystem company ${selectedCompany.name} is a strategic leader.`}
                     </p>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-brand-bg relative z-10">
                        <div>
                           <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark/30 mb-4">Guiding Principles</h4>
                           <div className="flex flex-wrap gap-2">
                              {selectedCompany.values?.slice(0, 4).map(val => (
                                <Badge key={val} className="bg-brand-bg text-brand-dark border-none rounded-full px-4 py-1.5 font-bold uppercase tracking-widest text-[8px] shadow-sm">
                                   {val}
                                </Badge>
                              ))}
                           </div>
                        </div>
                        <div>
                           <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark/30 mb-4">Strategic Nodes</h4>
                           <div className="flex flex-wrap gap-2">
                              {selectedCompany.needs?.slice(0, 4).map(need => (
                                <Badge key={need} variant="outline" className="border-brand-dark/5 text-brand-dark/30 rounded-full px-4 py-1.5 font-bold text-[9px] tracking-tight">
                                   {need}
                                </Badge>
                              ))}
                           </div>
                        </div>
                     </div>
                     <div className="absolute top-0 right-0 w-24 h-24 bg-brand-bg rounded-bl-[3rem]" />
                  </Card>

                  <Card className="rounded-[2.2rem] border-none bg-white p-10 shadow-sm">
                     <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-brand-dark rounded-xl flex items-center justify-center text-brand-yellow shadow-lg">
                              <Shield size={20} />
                           </div>
                           <h3 className="text-xl font-bold tracking-tight">Regulatory Matrix</h3>
                        </div>
                        <Badge className="bg-brand-dark text-white rounded-full px-4 py-1.5 font-bold tracking-widest text-[9px]">SYNC-ID: {selectedCompany.id.toUpperCase()}</Badge>
                     </div>
                     
                     <div className="space-y-6">
                        {/* SSM SECTION */}
                        <div className="p-6 rounded-[1.8rem] bg-brand-bg/50 border border-transparent hover:border-brand-yellow/30 transition-all">
                           <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center font-bold text-[10px] shadow-sm border border-brand-dark/5">SSM</div>
                                 <div>
                                    <p className="font-bold text-base leading-tight">Companies Commission (SSM)</p>
                                    <p className="text-[9px] font-bold text-brand-dark/30 uppercase tracking-widest font-mono">Verified Node</p>
                                 </div>
                              </div>
                              <Badge className={`${selectedCompany.compliance?.ssm === 'VERIFIED' ? 'bg-green-500 text-white' : 'bg-brand-yellow text-brand-dark'} border-none uppercase font-bold text-[9px] px-3 py-1 rounded-full`}>
                                 {selectedCompany.compliance?.ssm}
                              </Badge>
                           </div>
                        </div>

                        {/* BNM SECTION */}
                        <div className="p-6 rounded-[1.8rem] bg-brand-bg/50 border border-transparent hover:border-brand-yellow/30 transition-all">
                           <div className="flex justify-between items-start">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center font-bold text-[10px] shadow-sm border border-brand-dark/5">BNM</div>
                                 <div>
                                    <p className="font-bold text-base leading-tight">Bank Negara Malaysia</p>
                                    <p className="text-[9px] font-bold text-brand-dark/30 uppercase tracking-widest font-mono">Cleared Node</p>
                                 </div>
                              </div>
                              <Badge className={`${selectedCompany.compliance?.bnm === 'CLEARED' ? 'bg-blue-500 text-white' : 'bg-brand-yellow text-brand-dark'} border-none uppercase font-bold text-[9px] px-3 py-1 rounded-full`}>
                                 {selectedCompany.compliance?.bnm}
                              </Badge>
                           </div>
                        </div>
                        {/* LHDN SECTION */}
                        <div className="p-8 rounded-[2rem] bg-brand-bg/50 border border-transparent hover:border-brand-yellow/30 transition-all">
                           <div className="flex justify-between items-start mb-6">
                              <div className="flex items-center gap-5">
                                 <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center font-bold text-sm shadow-sm border border-brand-dark/5">LHDN</div>
                                 <div>
                                    <p className="font-bold text-lg">Lembaga Hasil Dalam Negeri</p>
                                    <p className="text-[10px] font-bold text-brand-dark/30 uppercase tracking-widest">Tax Ledger Authority</p>
                                 </div>
                              </div>
                              <Badge className={`${selectedCompany.compliance?.lhdn === 'ACTIVE' ? 'bg-green-500 text-white' : 'bg-brand-yellow text-brand-dark'} border-none uppercase font-bold text-[10px] px-4 py-1.5 rounded-full shadow-sm`}>
                                 {selectedCompany.compliance?.lhdn}
                              </Badge>
                           </div>
                        </div>
                     </div>
                  </Card>
               </div>

               <div className="space-y-10">
                  <Card className="rounded-[2.5rem] border-none bg-brand-dark text-white p-12 shadow-2xl shadow-brand-dark/30 overflow-hidden relative">
                     <h3 className="text-2xl font-bold mb-10 tracking-tight relative z-10">System Vitality</h3>
                     <div className="flex items-center justify-center mb-10 relative z-10">
                        <div className="relative w-48 h-48 flex items-center justify-center">
                           <svg className="w-full h-full transform -rotate-90">
                              <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-white/5" />
                              <motion.circle 
                                 cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="16" fill="transparent" 
                                 className="text-brand-yellow"
                                 strokeDasharray={552.9}
                                 initial={{ strokeDashoffset: 552.9 }}
                                 animate={{ strokeDashoffset: 0 }}
                                 transition={{ duration: 2, ease: "easeOut" }}
                              />
                           </svg>
                           <div className="absolute flex flex-col items-center">
                              <span className="text-5xl font-bold tracking-tighter">VITAL</span>
                              <span className="text-[10px] font-bold text-brand-yellow uppercase tracking-[0.3em] mt-2">Compliance</span>
                           </div>
                        </div>
                     </div>
                     <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full" />
                  </Card>

                  <Card className="rounded-[2.5rem] border-none bg-white p-10 shadow-sm">
                     <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-dark/30 mb-8">Strategic Linkages</h3>
                     <div className="space-y-6">
                        {ecosystem.linkages.filter(l => l.target === selectedCompanyId).map(link => {
                           const mentor = ecosystem.mentors.find(m => m.id === link.source);
                           return (
                              <div key={link.id} className="flex items-center gap-5 p-5 rounded-[1.5rem] bg-brand-bg/50 border border-transparent hover:border-brand-yellow/30 transition-all group">
                                 <Avatar className="w-12 h-12 rounded-2xl shadow-sm border-2 border-white group-hover:border-brand-yellow transition-all">
                                    <AvatarImage src={mentor?.avatar} />
                                 </Avatar>
                                 <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold truncate tracking-tight">{mentor?.name}</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/30">{link.type}</p>
                                 </div>
                                 <Badge className="bg-brand-dark text-white text-[9px] font-bold px-3 py-1 rounded-full">{link.status}</Badge>
                              </div>
                           );
                        })}
                        {ecosystem.linkages.filter(l => l.target === selectedCompanyId).length === 0 && (
                           <div className="text-center py-12">
                              <div className="w-16 h-16 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-4 text-brand-dark/10">
                                 <Handshake size={32} />
                              </div>
                              <p className="text-sm font-bold text-brand-dark/20 uppercase tracking-widest">No active linkages</p>
                           </div>
                        )}
                     </div>
                  </Card>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-brand-bg text-[#1A1A1A] font-sans selection:bg-[#E9ECEF] overflow-y-auto">
      {/* Sidebar Navigation */}
      <nav className="fixed left-0 top-0 h-screen w-24 flex flex-col items-center py-10 bg-white/40 backdrop-blur-xl border-r border-[#141414]/5 z-50">
        <div className="mb-14 cursor-pointer group" onClick={() => setRole('NONE')}>
           <div className="w-14 h-14 bg-brand-dark rounded-2xl flex items-center justify-center text-brand-yellow shadow-xl shadow-brand-dark/20 group-hover:scale-110 transition-transform">
              <SyncraLogo size={32} />
           </div>
        </div>
        
        <div className="flex-1 flex flex-col gap-8">
          {role === 'ADMIN' && (
            <>
              <NavItem icon={<Sparkles size={24} />} active={activeScreen === 'PROPOSAL_BUILDER'} onClick={() => setActiveScreen('PROPOSAL_BUILDER')} label="Cohorts" />
              <NavItem icon={<Activity size={24} />} active={activeScreen === 'SP_ACTIVITY'} onClick={() => setActiveScreen('SP_ACTIVITY')} label="Activity" />
              <NavItem icon={<BarChart3 size={24} />} active={activeScreen === 'TRACKER'} onClick={() => setActiveScreen('TRACKER')} label="Admin" />
            </>
          )}
          {role === 'FOUNDER' && (
            <NavItem icon={<Layers size={24} />} active={activeScreen === 'FOUNDER_HUB'} onClick={() => setActiveScreen('FOUNDER_HUB')} label="Hub" />
          )}
          <NavItem icon={<Search size={24} />} active={activeScreen === 'DISCOVERY'} onClick={() => setActiveScreen('DISCOVERY')} label="Library" />
          <NavItem icon={<Users size={24} />} active={activeScreen === 'NETWORK'} onClick={() => setActiveScreen('NETWORK')} label="Network" />
          <NavItem icon={<Bot size={24} />} active={activeScreen === 'AGENT'} onClick={() => setActiveScreen('AGENT')} label="Chat" />
        </div>

        <div className="mt-auto pb-4">
          <Button variant="ghost" size="icon" className="rounded-xl text-[#141414]/20 hover:text-[#141414]" onClick={() => setRole('NONE')}>
            <X size={20} />
          </Button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="ml-24 min-h-screen p-8 lg:p-12 relative">
        <AnimatePresence mode="wait">
          {activeScreen === 'FOUNDER_HUB' && role === 'FOUNDER' && (
            <motion.div 
              key="founder_hub"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto"
            >
               <h1 className="text-5xl font-bold tracking-tight mb-16">Welcome in, ZenPay</h1>
               
               <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-10">
                  <div className="flex flex-col gap-10">
                    <Card className="rounded-[2.5rem] border-none bg-white p-10 text-center shadow-sm relative overflow-hidden">
                      <div className="relative z-10">
                        <Avatar className="w-28 h-28 mx-auto mb-6 border-4 border-brand-bg shadow-lg">
                          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nabilah" />
                          <AvatarFallback>UN</AvatarFallback>
                        </Avatar>
                        <h2 className="text-2xl font-bold mb-1">ZenPay Global</h2>
                        <p className="text-sm text-[#141414]/40 mb-10 font-medium">Founder: Nabilah Abas</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-brand-bg p-5 rounded-3xl">
                            <p className="text-[10px] uppercase font-bold tracking-widest opacity-40 mb-2">Linkages</p>
                            <p className="text-2xl font-bold">3</p>
                          </div>
                          <div className="bg-brand-bg p-5 rounded-3xl">
                            <p className="text-[10px] uppercase font-bold tracking-widest opacity-40 mb-2">Growth</p>
                            <p className="text-2xl font-bold text-brand-dark">A+</p>
                          </div>
                        </div>
                      </div>
                      <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-brand-yellow/10 rounded-full blur-3xl" />
                    </Card>

                    <Card className="rounded-[2.5rem] border-none bg-white p-8 shadow-sm">
                      <h3 className="text-[10px] uppercase font-bold tracking-widest opacity-40 mb-8">Active Programmes</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-brand-bg rounded-2xl">
                          <span className="text-xs font-bold">Global Scaleup 2026</span>
                          <Badge className="bg-brand-yellow text-brand-dark border-none font-bold text-[9px] px-3">ACTIVE</Badge>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="space-y-10">
                    <Card className="rounded-[2.5rem] border-none bg-white p-10 shadow-sm relative overflow-hidden">
                      <div className="flex items-center justify-between mb-10 relative z-10">
                        <h3 className="text-2xl font-bold tracking-tight">Your Ecosystem Progress</h3>
                        <Button variant="ghost" className="text-brand-dark opacity-40 hover:opacity-100 font-bold text-xs uppercase tracking-widest">Verify All</Button>
                      </div>
                      <div className="space-y-8 relative z-10">
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
                      <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-brand-bg rounded-full border border-brand-dark/5" />
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <Card className="rounded-[2.5rem] border-none bg-brand-dark text-white p-10 relative overflow-hidden shadow-2xl shadow-brand-dark/20 min-h-[320px] flex flex-col justify-center">
                          <AnimatePresence mode="wait">
                            {isCompiling ? (
                              <motion.div 
                                key="compiling"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="relative z-10 h-full flex flex-col justify-center"
                              >
                                <h3 className="text-sm font-bold uppercase tracking-[0.4em] mb-8 text-brand-yellow">AI Linkage Engine</h3>
                                <div className="space-y-6">
                                   <div className="flex justify-between items-end">
                                      <p className="text-[10px] opacity-40 uppercase tracking-[0.2em]">Synthesizing Ecosystem Nodes...</p>
                                      <span className="text-4xl font-bold">{compilationProgress}%</span>
                                   </div>
                                   <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                      <motion.div 
                                        className="h-full bg-brand-yellow"
                                        animate={{ width: `${compilationProgress}%` }}
                                      />
                                   </div>
                                   <div className="flex gap-2">
                                      {compilationProgress > 20 && <Badge className="bg-brand-yellow text-brand-dark border-none text-[8px] font-bold rounded-full">SSM VERIFIED</Badge>}
                                      {compilationProgress > 50 && <Badge className="bg-brand-yellow text-brand-dark border-none text-[8px] font-bold rounded-full">BNM CLEARED</Badge>}
                                      {compilationProgress > 80 && <Badge className="bg-brand-yellow text-brand-dark border-none text-[8px] font-bold rounded-full">ECOSYSTEM SYNC</Badge>}
                                   </div>
                                </div>
                              </motion.div>
                            ) : reportsReady ? (
                              <motion.div 
                                key="ready"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative z-10"
                              >
                                <div className="w-16 h-16 bg-brand-yellow rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-brand-yellow/20">
                                   <CheckCircle2 size={32} className="text-brand-dark" />
                                </div>
                                <h3 className="text-3xl font-bold tracking-tight mb-3">Intelligence Sync Ready</h3>
                                <p className="opacity-60 mb-10 text-sm leading-relaxed max-w-xs">Data analysis has been pushed to the Programme Administrator dashboard.</p>
                                <Button 
                                  variant="outline" 
                                  className="border-white/10 text-white hover:bg-white/5 rounded-full px-10 h-12 text-xs font-bold tracking-widest uppercase"
                                  onClick={() => setReportsReady(false)}
                                >
                                  Return to Hub
                                </Button>
                              </motion.div>
                            ) : (
                              <motion.div 
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="relative z-10"
                              >
                                <h3 className="text-3xl font-bold tracking-tight mb-3 leading-tight">Compile Next<br/>Ecosystem Audit</h3>
                                <p className="opacity-40 mb-10 max-w-xs text-sm leading-relaxed">Automated verification will sync data across Cradle, LHDN, and BNM nodes.</p>
                                <Button 
                                  className="bg-brand-yellow text-brand-dark rounded-full px-10 h-14 font-bold hover:bg-white hover:scale-105 transition-all shadow-xl shadow-brand-yellow/10"
                                  onClick={runAiGovernanceEngine}
                                >
                                  Prepare Data
                                </Button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <Sparkles className={`absolute -right-8 -bottom-8 w-48 h-48 opacity-10 rotate-12 transition-all ${isCompiling ? 'animate-pulse scale-110 opacity-30 text-brand-yellow' : ''}`} />
                        </Card>
                       <Card className="rounded-[2.5rem] border-none bg-white p-10 shadow-sm relative overflow-hidden">
                          <h3 className="text-2xl font-bold tracking-tight mb-8">Market Readiness</h3>
                          <div className="space-y-8 relative z-10">
                             <ProgressRow label="Technical Stability" value={92} trackColor="bg-brand-yellow" />
                             <ProgressRow label="Market Traction" value={78} trackColor="bg-brand-yellow" />
                             <ProgressRow label="Partnership Logic" value={65} trackColor="bg-brand-yellow" />
                          </div>
                          <div className="absolute right-0 bottom-0 w-32 h-32 bg-brand-bg rounded-tl-[3rem]" />
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
              className="max-w-7xl mx-auto space-y-10 pb-20"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
                <div>
                  <Badge className="bg-brand-dark text-brand-yellow mb-4 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[10px]">Fleet Coordination</Badge>
                  <h1 className="text-5xl font-bold tracking-tighter mb-4 leading-tight">Ecosystem <span className="text-brand-yellow italic font-medium">Activity</span> Feed.</h1>
                  <p className="text-brand-dark/40 text-xl font-medium max-w-2xl">Real-time monitoring of vetted ecosystem specialists and strategic partners across stakeholders.</p>
                </div>
                <div className="flex gap-4">
                   <Card className="bg-white p-6 rounded-2xl shadow-sm border border-brand-bg flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-500/10 text-green-600 rounded-xl flex items-center justify-center">
                         <Activity size={24} />
                      </div>
                      <div>
                         <p className="text-2xl font-bold">14</p>
                         <p className="text-[10px] font-bold uppercase tracking-widest opacity-30">Active Tasks</p>
                      </div>
                   </Card>
                   <Card className="bg-white p-6 rounded-2xl shadow-sm border border-brand-bg flex items-center gap-4">
                      <div className="w-12 h-12 bg-brand-yellow/10 text-brand-yellow rounded-xl flex items-center justify-center">
                         <Target size={24} />
                      </div>
                      <div>
                         <p className="text-2xl font-bold">88%</p>
                         <p className="text-[10px] font-bold uppercase tracking-widest opacity-30">Utilization</p>
                      </div>
                   </Card>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Partner Box */}
                <Card className="rounded-[2.5rem] border-none bg-white p-8 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                      <Handshake size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold tracking-tight">Partner Activity</h3>
                      <p className="text-[10px] font-bold text-brand-dark/30 uppercase tracking-widest">Strategic partners</p>
                    </div>
                    <Badge className="ml-auto bg-blue-50 text-blue-600 border-none text-[9px] font-bold px-3 py-1 rounded-full">{ecosystem.partners.length} Partners</Badge>
                  </div>

                  <div className="space-y-3 mb-6">
                    {[
                      { sp: 'Venture Capital X', action: 'vetted', target: 'Solaris energy', time: '28m ago', type: 'Series A Bridge' },
                      { sp: 'Global Logistics Hub', action: 'linked', target: 'GreenMart', time: '1h ago', type: 'Supply Chain Sync' },
                      { sp: 'Cloud Infrastructure Ltd', action: 'provided', target: 'DataFlow', time: '4h ago', type: 'Instance Setup' },
                    ].map((activity, i) => (
                      <div key={i} className="group flex items-center gap-4 p-4 rounded-2xl bg-brand-bg/30 hover:bg-blue-50/50 transition-all">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600 shrink-0">
                          <Handshake size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{activity.sp}</p>
                          <p className="text-[11px] text-brand-dark/50 truncate">
                            {activity.action} <span className="font-bold text-brand-dark/70">{activity.type}</span> for {activity.target}
                          </p>
                        </div>
                        <span className="text-[9px] font-bold text-brand-dark/30 uppercase shrink-0">{activity.time}</span>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-brand-dark/5 mb-6" />

                  <h4 className="text-[10px] font-bold text-brand-dark/30 uppercase tracking-widest mb-4">Node Status</h4>
                  <div className="space-y-3">
                    {ecosystem.partners.map(sp => (
                      <div key={sp.id} className="flex items-center gap-4 p-4 rounded-2xl bg-brand-bg/30">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                          <Handshake size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{sp.name}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {sp.expertise?.slice(0, 2).map(exp => (
                              <span key={exp} className="text-[8px] font-bold text-brand-dark/30 uppercase">{exp}</span>
                            ))}
                          </div>
                        </div>
                        <Badge className={`${sp.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-brand-dark/5 text-brand-dark/30'} border-none text-[8px] uppercase font-bold px-2 py-0.5 rounded-full shrink-0`}>
                          {sp.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Service Provider Box */}
                <Card className="rounded-[2.5rem] border-none bg-white p-8 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-brand-yellow/10 text-brand-yellow rounded-xl flex items-center justify-center">
                      <Wrench size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold tracking-tight">Service Provider Activity</h3>
                      <p className="text-[10px] font-bold text-brand-dark/30 uppercase tracking-widest">Scaling specialists</p>
                    </div>
                    <Badge className="ml-auto bg-brand-yellow/10 text-brand-yellow border-none text-[9px] font-bold px-3 py-1 rounded-full">{ecosystem.serviceProviders.length} Providers</Badge>
                  </div>

                  <div className="space-y-3 mb-6">
                    {[
                      { sp: 'Scale-up Specialists', action: 'completed', target: 'AgroFlow Tech', time: '12m ago', type: 'IP Filings' },
                      { sp: 'Ops Architects', action: 'initiated', target: 'FinEdge Solutions', time: '45m ago', type: 'Cloud Migration' },
                      { sp: 'Legal Guardians', action: 'flagged', target: 'BioPulse', time: '2h ago', type: 'Compliance Review' },
                      { sp: 'Growth Hackers', action: 'assigned', target: 'MarketMatrix', time: '5h ago', type: 'GTM Strategy' },
                    ].map((activity, i) => (
                      <div key={i} className="group flex items-center gap-4 p-4 rounded-2xl bg-brand-bg/30 hover:bg-brand-yellow/5 transition-all">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          activity.action === 'flagged' ? 'bg-red-50 text-red-600' : 'bg-brand-yellow/10 text-brand-yellow'
                        }`}>
                          {activity.action === 'flagged' ? <Shield size={16} /> : <Wrench size={16} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{activity.sp}</p>
                          <p className="text-[11px] text-brand-dark/50 truncate">
                            {activity.action} <span className="font-bold text-brand-dark/70">{activity.type}</span> for {activity.target}
                          </p>
                        </div>
                        <span className="text-[9px] font-bold text-brand-dark/30 uppercase shrink-0">{activity.time}</span>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-brand-dark/5 mb-6" />

                  <h4 className="text-[10px] font-bold text-brand-dark/30 uppercase tracking-widest mb-4">Node Status</h4>
                  <div className="space-y-3">
                    {ecosystem.serviceProviders.map(sp => (
                      <div key={sp.id} className="flex items-center gap-4 p-4 rounded-2xl bg-brand-bg/30">
                        <div className="w-10 h-10 bg-brand-bg rounded-xl flex items-center justify-center text-brand-dark shrink-0">
                          <Wrench size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{sp.name}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {sp.expertise?.slice(0, 2).map(exp => (
                              <span key={exp} className="text-[8px] font-bold text-brand-dark/30 uppercase">{exp}</span>
                            ))}
                          </div>
                        </div>
                        <Badge className={`${sp.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-brand-dark/5 text-brand-dark/30'} border-none text-[8px] uppercase font-bold px-2 py-0.5 rounded-full shrink-0`}>
                          {sp.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
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
                    <h1 className="text-4xl font-medium font-serif italic mb-2 tracking-tight">AI Cohort Maker.</h1>
                    <p className="text-[#141414]/50 max-w-md">Gemini-driven cohort assembly across mentors, mentees, and strategic support units.</p>
                 </div>
                 <Button variant="outline" className="rounded-2xl gap-2 font-mono text-[10px] uppercase tracking-widest px-6 h-12">
                    <Sparkles size={14} /> Generate New Cohort
                 </Button>
              </div>

              <div className="space-y-12">
                {(() => {
                  const pendingCohort = (ecosystem.proposals || []).find(p => p.status === 'PENDING');
                  
                  if (!pendingCohort) {
                    return (
                      <Card className="rounded-[2.5rem] border-none bg-white p-20 shadow-sm text-center">
                         <div className="w-20 h-20 bg-brand-bg rounded-3xl flex items-center justify-center mx-auto mb-8 text-brand-dark/20">
                            <CheckCircle2 size={40} />
                         </div>
                         <h2 className="text-3xl font-bold mb-4">All Cohorts Processed</h2>
                         <p className="text-brand-dark/40 max-w-sm mx-auto font-medium">Your triage queue is empty. New AI-generated suggestions will appear here automatically.</p>
                         <Button 
                           variant="outline" 
                           className="mt-10 rounded-full px-10 h-14 border-brand-dark/10 font-bold text-xs uppercase tracking-widest"
                           onClick={() => setActiveScreen('TRACKER')}
                         >
                            Back to Admin Dashboard
                         </Button>
                      </Card>
                    );
                  }

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Card className="rounded-[2.5rem] border-[#141414]/5 bg-white p-10 shadow-lg relative overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 relative z-10">
                           <div>
                              <div className="flex items-center gap-3 mb-6">
                                 <Badge className="bg-[#141414] text-white px-4 py-1 rounded-full font-mono text-[9px] tracking-widest uppercase">COHORT SUGGESTION</Badge>
                                 <Badge variant="outline" className="border-[#141414]/10 text-[#141414]/40 font-mono text-[9px] tracking-widest uppercase">ID: {pendingCohort.id}</Badge>
                              </div>
                              <h2 className="text-5xl font-bold tracking-tighter mb-8">{pendingCohort.name}</h2>
                              <p className="text-[#141414]/60 bg-[#F8F9FA] p-8 rounded-[2rem] border-l-4 border-[#141414] mb-10 leading-relaxed italic text-lg">
                                 "{pendingCohort.logic}"
                              </p>
                              
                              <div className="grid grid-cols-2 gap-12 mb-10">
                                 <div>
                                    <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-30 mb-6">Suggested Mentees</h4>
                                    <div className="flex -space-x-4">
                                       {pendingCohort.suggestedCompanies.map(id => (
                                         <Avatar key={id} className="w-16 h-16 border-4 border-white bg-[#F5F5F0] flex items-center justify-center shadow-md">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${id}`} />
                                         </Avatar>
                                       ))}
                                    </div>
                                 </div>
                                 <div>
                                    <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-30 mb-6">Suggested Mentors</h4>
                                    <div className="flex -space-x-4">
                                       {pendingCohort.suggestedMentors.map(id => (
                                         <Avatar key={id} className="w-16 h-16 border-4 border-white shadow-md">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`} />
                                         </Avatar>
                                       ))}
                                    </div>
                                 </div>
                              </div>

                              <div className="flex items-center gap-4 py-8 border-t border-[#141414]/5 mt-10">
                                <span className="text-[10px] font-mono uppercase tracking-widest opacity-30">Infra & Legal Mapping:</span>
                                {pendingCohort.suggestedPartners.map(p => <Badge key={p} variant="secondary" className="bg-[#F8F9FA] text-[10px] py-1.5 px-4 rounded-full font-bold">{p}</Badge>)}
                                {pendingCohort.suggestedProviders.map(sp => <Badge key={sp} variant="secondary" className="bg-[#F8F9FA] text-[10px] py-1.5 px-4 rounded-full font-bold">{sp}</Badge>)}
                              </div>
                           </div>

                           <div className="flex flex-col justify-center gap-6 bg-brand-bg p-10 rounded-[2.5rem] border border-[#141414]/5">
                              <p className="text-center text-[10px] text-[#141414]/40 font-bold uppercase tracking-[0.2em] mb-4">Admin Governance</p>
                              <Button 
                                className="bg-[#141414] text-white rounded-3xl h-16 w-full shadow-2xl hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-3 font-bold text-sm tracking-tight"
                                onClick={() => {
                                   setEcosystem(prev => ({
                                      ...prev,
                                      proposals: prev.proposals.map(p => p.id === pendingCohort.id ? { ...p, status: 'APPROVED' } : p)
                                   }));
                                }}
                              >
                                 Approve Cohort <CheckCircle2 size={20} />
                              </Button>
                              <Button 
                                variant="outline" 
                                className="rounded-3xl h-16 w-full border-[#141414]/10 bg-white text-[#141414] hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all flex items-center justify-center gap-3 font-bold text-sm tracking-tight"
                                onClick={() => {
                                   setEcosystem(prev => ({
                                      ...prev,
                                      proposals: prev.proposals.map(p => p.id === pendingCohort.id ? { ...p, status: 'DISMISSED' } : p)
                                   }));
                                }}
                              >
                                 Reject Structure <X size={20} />
                              </Button>

                              <p className="text-[9px] text-center text-brand-dark/20 mt-4 leading-relaxed font-medium">Decisions are final and will initiate<br/>the linkage automation sequence.</p>
                           </div>
                        </div>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-brand-bg rounded-bl-[5rem] flex items-center justify-center">
                           <Bot size={64} className="text-brand-dark/5" />
                        </div>
                      </Card>
                    </motion.div>
                  );
                })()}
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
                            <Button 
                              onClick={() => p.status === 'REGISTERING' ? handleApplyNow(p.name) : null}
                              className={`w-full rounded-xl text-xs font-mono uppercase tracking-widest ${p.status === 'REGISTERING' ? 'bg-brand-dark text-white hover:bg-brand-dark/90' : 'bg-brand-dark text-white hover:bg-brand-dark/90'}`}
                            >
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

              <Card className="rounded-3xl border-[#141414]/5 bg-white p-8 shadow-sm mb-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-[#141414] rounded-xl flex items-center justify-center text-white">
                        <Target size={20} />
                     </div>
                     <h3 className="text-xl font-medium">Governance Data Analysis</h3>
                  </div>
                  {reportsReady && <Badge className="bg-blue-100 text-blue-700 animate-pulse border-none px-4">NEW AI INSIGHTS READY</Badge>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {ecosystem.analystInsights?.map(insight => (
                     <div key={insight.id} className="p-6 rounded-3xl bg-[#F8F9FA] border border-[#141414]/5 hover:border-[#141414]/20 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                           <span className={`text-[8px] font-mono px-2 py-0.5 rounded uppercase tracking-widest ${
                              insight.impact === 'CRITICAL' ? 'bg-red-100 text-red-600' : 
                              insight.impact === 'HIGH' ? 'bg-orange-100 text-orange-600' : 
                              'bg-blue-100 text-blue-600'
                           }`}>{insight.impact} Priority</span>
                           <Sparkles size={14} className="opacity-10 group-hover:opacity-40 transition-opacity" />
                        </div>
                        <h4 className="font-semibold text-sm mb-2">{insight.title}</h4>
                        <p className="text-xs text-[#141414]/50 leading-relaxed mb-4">{insight.insight}</p>
                        <Button 
                          variant="link" 
                          onClick={() => triggerAuditGeneration(insight.title)}
                          className="p-0 h-auto text-[10px] font-mono tracking-widest uppercase text-[#141414] group-hover:translate-x-1 transition-transform"
                        >
                           {insight.title === 'Mentor Performance' ? 'VIEW FULL MENTOR ANALYSIS' : 'VIEW FULL AUDIT'} <ChevronRight size={10} className="ml-1" />
                        </Button>
                     </div>
                   )) || (
                     <div className="col-span-3 py-12 text-center bg-[#F8F9FA] rounded-3xl border-2 border-dashed border-[#141414]/5">
                        <p className="text-[#141414]/30 font-mono text-xs uppercase tracking-[0.2em]">Awaiting Data Preparation from Governance Side</p>
                     </div>
                   )}
                </div>
              </Card>

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
                      <div 
                        key={company.id} 
                        onClick={() => setSelectedCompanyId(company.id)}
                        className="grid grid-cols-[1fr_120px_150px_100px_40px] gap-4 items-center px-4 py-6 border-b border-[#141414]/5 last:border-none hover:bg-[#F8F9FA]/50 transition-all rounded-2xl group cursor-pointer"
                      >
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
                                    animate={{ width: '100%' }}
                                    className="h-full bg-green-500" 
                                  />
                                </div>
                               <span className="text-[10px] font-bold uppercase text-green-600 tracking-tighter">Verified</span>
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
              className="max-w-7xl mx-auto px-4 pb-20"
            >
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-16 sticky top-0 bg-brand-bg/95 backdrop-blur-sm z-10 py-6 -mt-6 -mx-4 px-4">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight mb-3 text-center lg:text-left">Ecosystem Directory</h1>
                  <p className="text-sm font-medium text-brand-dark opacity-40 text-center lg:text-left uppercase tracking-widest">A unified hub for verified ecosystem founders, mentors, and partners.</p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 bg-white p-2 rounded-[2rem] shadow-sm border border-brand-dark/5">
                  <FilterToggle label="All Entities" active={networkFilter === 'ALL'} onClick={() => setNetworkFilter('ALL')} />
                  <FilterToggle label="Mentors" active={networkFilter === 'MENTOR'} onClick={() => setNetworkFilter('MENTOR')} />
                  <FilterToggle label="Partners" active={networkFilter === 'PARTNER'} onClick={() => setNetworkFilter('PARTNER')} />
                  <FilterToggle label="Providers" active={networkFilter === 'SERVICE_PROVIDER'} onClick={() => setNetworkFilter('SERVICE_PROVIDER')} />
                  <FilterToggle label="Ventures" active={networkFilter === 'COMPANY'} onClick={() => setNetworkFilter('COMPANY')} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10">
                 {filteredMembers.map(member => (
                   <FlippableMemberCard key={member.id} member={member} onCompanyClick={setSelectedCompanyId} />
                 ))}
              </div>
            </motion.div>
          )}

          {activeScreen === 'AGENT' && (
            <motion.div 
               key="agent"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0 }}
               className="max-w-7xl mx-auto min-h-[calc(100vh-140px)] flex flex-col px-4 w-full pb-10"
            >
               <div className="text-center mb-4 pt-2 flex flex-col items-center shrink-0">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring" }}
                    className="w-16 h-16 bg-brand-dark rounded-[1.4rem] flex items-center justify-center text-brand-yellow mb-3 shadow-xl relative"
                  >
                    <SyncraLogo size={36} />
                    <div className="absolute -inset-1.5 bg-brand-yellow/5 rounded-[1.8rem] animate-pulse -z-10" />
                  </motion.div>
                  <h1 className="text-3xl font-extrabold tracking-tighter mb-2 text-brand-dark leading-tight">Syncra Connect</h1>
                  
                  <div className="flex bg-brand-bg/50 p-1 rounded-2xl mt-2 border border-brand-bg shrink-0">
                    <button 
                      onClick={() => {
                        setActiveAgentTab('AI_AGENT');
                        setSelectedNodeId(null);
                      }}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${activeAgentTab === 'AI_AGENT' ? 'bg-brand-dark text-brand-yellow shadow-lg' : 'text-brand-dark/40 hover:text-brand-dark'}`}
                    >
                      <Sparkles size={12} />
                      Syncra Intelligence
                    </button>
                    <button 
                      onClick={() => setActiveAgentTab('DIRECT_LINKAGE')}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${activeAgentTab === 'DIRECT_LINKAGE' ? 'bg-brand-dark text-brand-yellow shadow-lg' : 'text-brand-dark/40 hover:text-brand-dark'}`}
                    >
                      <MessageSquare size={12} />
                      Syncra Chat
                    </button>
                  </div>
               </div>

               <div className="flex-1 bg-white rounded-[2.5rem] shadow-xl shadow-brand-dark/5 flex flex-col overflow-y-auto mb-2 border border-brand-bg min-h-0">
                  <ScrollArea className="flex-1 scroll-smooth">
                    <div className="max-w-6xl mx-auto p-6 md:p-10">
                        {(() => {
                          const isDirectLinkage = activeAgentTab === 'DIRECT_LINKAGE';
                          const currentChat = activeAgentTab === 'AI_AGENT' 
                            ? agentChat 
                            : (selectedNodeId ? (nodeChats[selectedNodeId] || []) : []);
                          
                          const selectedNode = isDirectLinkage && selectedNodeId 
                            ? [...ecosystem.mentors, ...ecosystem.partners, ...ecosystem.serviceProviders].find(n => n.id === selectedNodeId)
                            : null;

                          if (activeAgentTab === 'AI_AGENT' && agentChat.length === 0) {
                            return (
                              <motion.div 
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 my-auto"
                              >
                                <PromptSuggestion text="Verify latest linkages" icon={<CheckCircle2 size={18}/>} />
                                <PromptSuggestion text="Match Alex with a venture" icon={<Handshake size={18}/>} />
                                <PromptSuggestion text="Show program velocity" icon={<BarChart3 size={18}/>} />
                                <PromptSuggestion text="Analyze regulatory trends" icon={<SyncraLogo size={20}/>} />
                              </motion.div>
                            );
                          }

                          if (isDirectLinkage && !selectedNodeId) {
                            return (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="flex flex-col items-center justify-center min-h-[400px] text-center px-4"
                              >
                                <div className="w-20 h-20 bg-brand-bg rounded-[2rem] flex items-center justify-center text-brand-dark/20 mb-8 shadow-inner">
                                  <Users size={32} />
                                </div>
                                <h2 className="text-2xl font-bold mb-4 tracking-tight">Ecosystem Linkage Hub</h2>
                                <p className="text-sm text-brand-dark/40 mb-10 max-w-sm font-medium">Select an authorized ecosystem node to initiate a secure direct linkage channel.</p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl">
                                  {[...ecosystem.mentors, ...ecosystem.partners, ...ecosystem.serviceProviders].map(node => (
                                    <button 
                                      key={node.id}
                                      onClick={() => setSelectedNodeId(node.id)}
                                      className="flex flex-col items-center p-6 bg-white rounded-[2rem] border border-brand-bg hover:border-brand-yellow hover:shadow-xl hover:-translate-y-1 transition-all group shadow-sm"
                                    >
                                      <Avatar className="w-16 h-16 mb-4 border-2 border-transparent group-hover:border-brand-yellow transition-all">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${node.id}`} />
                                      </Avatar>
                                      <span className="text-xs font-bold text-brand-dark group-hover:text-brand-dark truncate w-full text-center">{node.name}</span>
                                      <span className="text-[10px] font-bold text-brand-dark/20 uppercase tracking-widest mt-1">Verified Node</span>
                                    </button>
                                  ))}
                                  
                                  <button 
                                    onClick={() => setSelectedNodeId('ADMIN_HQ')}
                                    className="flex flex-col items-center p-6 bg-brand-dark rounded-[2rem] border border-brand-dark hover:shadow-xl hover:-translate-y-1 transition-all group shadow-sm text-white"
                                  >
                                    <div className="w-16 h-16 mb-4 rounded-full bg-brand-yellow flex items-center justify-center text-brand-dark">
                                      <Shield size={28} />
                                    </div>
                                    <span className="text-xs font-bold truncate w-full text-center">Syncra HQ</span>
                                    <span className="text-[10px] font-bold text-brand-yellow uppercase tracking-widest mt-1">Admin Channel</span>
                                  </button>
                                </div>
                              </motion.div>
                            );
                          }

                          return (
                            <div className="space-y-6 py-2">
                              {isDirectLinkage && selectedNodeId && (
                                <div className="flex items-center justify-between mb-8 p-5 bg-brand-bg/50 rounded-[2rem] border border-brand-bg">
                                  <div className="flex items-center gap-4">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => setSelectedNodeId(null)}
                                      className="h-10 w-10 p-0 rounded-full hover:bg-white transition-all hover:scale-110"
                                    >
                                      <ChevronLeft size={20} />
                                    </Button>
                                    <Avatar className="w-12 h-12 border-2 border-brand-yellow shadow-sm">
                                      <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${selectedNodeId}`} />
                                      <AvatarFallback>{selectedNodeId === 'ADMIN_HQ' ? 'HQ' : '?'}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h3 className="font-bold text-base leading-tight">
                                        {selectedNodeId === 'ADMIN_HQ' ? 'Syncra Admin HQ' : (selectedNode?.name || 'Ecosystem Node')}
                                      </h3>
                                      <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                        <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Connection Live</p>
                                      </div>
                                    </div>
                                  </div>
                                  <Badge className="bg-brand-dark text-white rounded-full px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest border-none">LINK-{selectedNodeId.slice(0, 4).toUpperCase()}</Badge>
                                </div>
                              )}

                              {currentChat.length === 0 && isDirectLinkage && selectedNodeId && (
                                <motion.div 
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="py-20 text-center"
                                >
                                  <p className="text-xs font-bold text-brand-dark/20 uppercase tracking-[0.2em]">Start a secure conversation with {selectedNodeId === 'ADMIN_HQ' ? 'HQ' : (selectedNode?.name || 'this node')}</p>
                                </motion.div>
                              )}

                              {(selectedNodeId === 'ADMIN_HQ' ? adminFounderChat : currentChat).map((msg, i) => {
                                const isBot = msg.role === 'bot';
                                let sender = '';
                                
                                if (activeAgentTab === 'AI_AGENT') {
                                  sender = isBot ? 'Syncra IQ Core' : 'Authorized Admin';
                                } else {
                                  if (selectedNodeId === 'ADMIN_HQ') {
                                    sender = isBot ? 'Programme HQ' : 'Me';
                                  } else {
                                    sender = isBot ? selectedNode?.name || 'Ecosystem Node' : 'Me';
                                  }
                                }

                                return (
                                  <motion.div 
                                    initial={{ opacity: 0, x: isBot ? -15 : 15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={i} 
                                    className={`flex flex-col ${isBot ? 'items-start' : 'items-end'} gap-2`}
                                  >
                                     <div className="flex items-center gap-2 opacity-30 uppercase font-bold text-[9px] tracking-[0.2em] px-3">
                                        {sender}
                                     </div>
                                     <div className={`p-5 rounded-[1.8rem] max-w-[85%] shadow-sm ${isBot ? 'bg-brand-bg text-brand-dark border border-brand-dark/5' : 'bg-brand-dark text-white shadow-xl shadow-brand-dark/10'}`}>
                                        <p className="text-sm leading-relaxed font-bold tracking-tight">{msg.content}</p>
                                     </div>
                                  </motion.div>
                                );
                              })}
                              {isLoading && activeAgentTab === 'AI_AGENT' && (
                                <div className="flex gap-1.5 p-5 bg-brand-bg rounded-[1.5rem] w-20 justify-center shadow-inner mt-4">
                                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-brand-dark" />
                                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-brand-dark" />
                                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-brand-dark" />
                                </div>
                              )}
                            </div>
                          );
                        })()}
                       <div ref={scrollRef} className="h-4" />
                    </div>
                  </ScrollArea>

                  <div className="p-6 md:p-10 border-t border-brand-bg bg-white shadow-[0_-10px_40px_-20px_rgba(0,0,0,0.06)] shrink-0">
                    <div className="relative max-w-6xl mx-auto">
                      <AnimatePresence>
                        {nodeMatches.length > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute bottom-full left-0 mb-6 bg-white border border-brand-bg rounded-[2rem] shadow-2xl p-3 flex flex-col w-72 z-[100] backdrop-blur-xl bg-white/90"
                          >
                            <p className="text-[9px] font-bold text-brand-dark/30 uppercase tracking-[0.2em] px-4 py-3 border-b border-brand-bg mb-2">Ecosystem Discovery</p>
                            {nodeMatches.map(node => (
                              <button 
                                key={node.id}
                                onClick={() => selectNodeMatch(node.name)}
                                className="flex items-center gap-4 px-4 py-3 hover:bg-brand-bg rounded-2xl transition-all text-left group"
                              >
                                <Avatar className="w-10 h-10 border border-brand-bg shadow-sm group-hover:border-brand-yellow transition-all">
                                  <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${node.id}`} />
                                </Avatar>
                                <div>
                                  <p className="text-xs font-bold text-brand-dark group-hover:text-brand-dark transition-colors">{node.name}</p>
                                  <p className="text-[9px] font-bold text-brand-dark/30 uppercase tracking-tighter">Verified Node</p>
                                </div>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div className="relative group">
                        <Input 
                          placeholder={activeAgentTab === 'AI_AGENT' ? "Inquire with Syncra Intelligence..." : (selectedNodeId ? `Secure message to ${selectedNodeId === 'ADMIN_HQ' ? 'Syncra Admin HQ' : ([...ecosystem.mentors, ...ecosystem.partners, ...ecosystem.serviceProviders].find(n => n.id === selectedNodeId)?.name)}...` : "Select a contact above to message...")}
                          disabled={activeAgentTab === 'DIRECT_LINKAGE' && !selectedNodeId}
                          className="pr-20 h-16 md:h-20 rounded-[2rem] md:rounded-[2.5rem] bg-brand-bg/40 border-none px-8 md:px-10 text-sm md:text-lg font-bold tracking-tight shadow-inner placeholder:text-brand-dark/20 focus-visible:ring-brand-yellow/30 focus-visible:bg-white transition-all disabled:opacity-20"
                          value={inputMessage}
                          onChange={(e) => handleInputChange(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button 
                           className="absolute right-3 top-3 h-10 w-10 md:h-14 md:w-14 p-0 rounded-[1.2rem] md:rounded-[1.8rem] bg-brand-dark text-brand-yellow hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-dark/20 disabled:hidden"
                           onClick={() => handleSendMessage()}
                           disabled={!inputMessage.trim() || (activeAgentTab === 'DIRECT_LINKAGE' && !selectedNodeId)}
                        >
                           <ChevronRight size={24} strokeWidth={3} />
                        </Button>
                      </div>
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
    <Card className="rounded-[2rem] border-none bg-white p-8 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer group" onClick={onSelect}>
      <div className="flex items-start gap-6">
        <div className="w-16 h-16 bg-brand-bg rounded-[1.5rem] flex items-center justify-center text-brand-dark group-hover:bg-brand-dark group-hover:text-brand-yellow transition-all shadow-inner">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-1 tracking-tight">{title}</h3>
          <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-brand-dark/30 mb-4">{subtitle}</p>
          <p className="text-xs text-brand-dark/60 leading-relaxed mb-6 font-medium">{description}</p>
          <div className="flex items-center gap-2 text-[10px] font-bold text-brand-dark group-hover:translate-x-2 transition-transform uppercase tracking-widest">
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
      className={`group relative cursor-pointer flex items-center justify-center w-12 h-12 rounded-[1.2rem] transition-all duration-500 ${
        active ? 'bg-brand-dark text-brand-yellow shadow-xl scale-110' : 'text-brand-dark/20 hover:text-brand-dark hover:bg-white/80'
      }`}
      onClick={onClick}
    >
      {icon}
      <div className="absolute left-16 px-4 py-2 bg-brand-dark text-white text-[10px] uppercase font-bold tracking-widest rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[100] shadow-2xl">
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

function FlippableMemberCard({ member, onCompanyClick }: { member: Member; onCompanyClick?: (id: string) => void; key?: React.Key }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    if (member.type === 'COMPANY' && onCompanyClick) {
      onCompanyClick(member.id);
    } else {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div 
      className="relative w-full h-[380px] perspective-1000 group cursor-pointer"
      onMouseEnter={() => member.type !== 'COMPANY' && setIsFlipped(true)}
      onMouseLeave={() => member.type !== 'COMPANY' && setIsFlipped(false)}
      onClick={handleCardClick}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 200, damping: 25 }}
      >
        {/* Front Face */}
        <div className="absolute inset-0 backface-hidden">
          <Card className="w-full h-full rounded-[2rem] border-none bg-white shadow-sm flex flex-col group-hover:shadow-xl transition-all overflow-hidden relative">
            <div className="p-8 flex flex-col h-full relative z-10">
              <div className="flex justify-between items-start mb-6">
                <Avatar className="w-14 h-14 rounded-2xl shadow-md border-2 border-brand-bg">
                  <AvatarImage src={member.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${member.id}`} />
                </Avatar>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={`text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border-none shadow-sm ${
                    member.type === 'MENTOR' ? 'bg-purple-500 text-white' :
                    member.type === 'PARTNER' ? 'bg-blue-500 text-white' :
                    member.type === 'SERVICE_PROVIDER' ? 'bg-orange-500 text-white' :
                    'bg-brand-yellow text-brand-dark'
                  }`}>
                    {member.type.replace('_', ' ')}
                  </Badge>
                  <Badge className="bg-green-50 text-green-600 border-none text-[8px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-sm">Verified Node</Badge>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-1 tracking-tight group-hover:text-brand-dark transition-colors">{member.name}</h3>
              <p className="text-[10px] text-brand-dark/40 uppercase tracking-[0.2em] font-bold mb-6">{member.role || member.stage || 'Stakeholder Entity'}</p>
              <p className="text-xs text-brand-dark/60 line-clamp-3 leading-relaxed mb-6 font-medium">
                {member.bio || member.description || `Verified ecosystem member since 2025 focusing on ${member.industry || 'innovation engineering'}.`}
              </p>
              <div className="mt-auto">
                <div className="flex flex-wrap gap-1.5">
                  {(member.expertise || []).slice(0, 3).map(skill => (
                    <span key={skill} className="text-[9px] font-bold text-brand-dark/40 bg-brand-bg px-2.5 py-1 rounded-full uppercase tracking-widest">{skill}</span>
                  ))}
                </div>
                <div className="pt-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-brand-dark/20 underline decoration-brand-yellow decoration-2 underline-offset-4">Explore Node</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-brand-bg rounded-full opacity-50 group-hover:scale-125 transition-transform" />
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
                  View More
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
    <Card className="rounded-[2.5rem] border-none bg-white p-8 shadow-sm group hover:scale-[1.02] transition-all">
       <p className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 mb-4">{title}</p>
       <div className="flex items-end justify-between">
          <p className="text-4xl font-bold tracking-tight text-brand-dark">{value}</p>
          <p className="text-[11px] font-bold text-green-500 mb-1 bg-green-50 px-3 py-1 rounded-full">{trend}</p>
       </div>
    </Card>
  );
}

function FilterToggle({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`px-8 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${
        active ? 'bg-brand-dark text-brand-yellow shadow-xl scale-105' : 'text-brand-dark/30 hover:text-brand-dark hover:bg-brand-bg'
      }`}
    >
      {label}
    </button>
  );
}

function PromptSuggestion({ text, icon }: { text: string, icon: React.ReactNode }) {
  return (
    <div className="p-8 bg-white border border-brand-bg rounded-[2.5rem] flex items-center gap-6 hover:bg-brand-bg hover:scale-[1.02] transition-all cursor-pointer group shadow-sm border-brand-dark/5">
       <div className="w-14 h-14 rounded-[1.2rem] bg-brand-bg group-hover:bg-brand-dark text-brand-dark group-hover:text-brand-yellow flex items-center justify-center transition-all shadow-inner">
          {icon}
       </div>
       <span className="text-base font-bold tracking-tight text-brand-dark/70 group-hover:text-brand-dark transition-colors">{text}</span>
    </div>
  );
}

function ProgressRow({ label, value, trackColor = "bg-brand-dark" }: { label: string, value: number, trackColor?: string }) {
  return (
    <div className="space-y-3">
       <div className="flex justify-between text-[11px] uppercase font-bold text-brand-dark/40 tracking-widest">
          <span>{label}</span>
          <span className="text-brand-dark">{value}%</span>
       </div>
       <div className="w-full h-2 bg-brand-bg rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className={`h-full ${trackColor}`}
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

function DefaultAuditReport({ ecosystem }: { ecosystem: EcosystemData }) {
  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter mb-3">Ecosystem Ledger <span className="text-brand-yellow font-light">Audit</span></h1>
          <p className="text-brand-dark/40 text-base font-medium">Programmable Regulatory Compliance Analysis • Q2 2026</p>
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <Button variant="outline" className="flex-1 lg:flex-none rounded-full h-12 px-8 border-brand-dark/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white">Export Node PDF</Button>
          <Button className="bg-brand-dark text-brand-yellow rounded-full px-10 h-12 text-xs font-bold uppercase tracking-widest shadow-xl shadow-brand-dark/20">Sync Cradle Ledger</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <Card className="rounded-[2.2rem] border-none bg-white p-8 flex flex-col justify-between shadow-sm group hover:scale-[1.02] transition-all">
          <p className="text-[9px] font-bold uppercase tracking-widest text-brand-dark/30 mb-10">Node Vitality</p>
          <div>
            <div className="flex items-baseline gap-2">
              <h4 className="text-3xl font-bold text-brand-dark tracking-tighter uppercase">Optimal</h4>
            </div>
            <p className="text-[9px] font-bold text-green-500 mt-2 bg-green-50 px-2.5 py-1 rounded-full inline-block uppercase">SYSTEM ACTIVE</p>
          </div>
        </Card>
        <Card className="rounded-[2.2rem] border-none bg-white p-8 flex flex-col justify-between shadow-sm group hover:scale-[1.02] transition-all">
          <p className="text-[9px] font-bold uppercase tracking-widest text-brand-dark/30 mb-10">Linkage Velocity</p>
          <div>
            <h4 className="text-4xl font-bold text-brand-dark tracking-tighter">+14.2%</h4>
            <p className="text-[9px] font-bold text-brand-dark/40 mt-1 uppercase tracking-wide">Monthly Delta</p>
          </div>
        </Card>
        <Card className="rounded-[2.2rem] border-none bg-white p-8 flex flex-col justify-between shadow-sm group hover:scale-[1.02] transition-all">
          <p className="text-[9px] font-bold uppercase tracking-widest text-brand-dark/30 mb-10">Regulatory Flags</p>
          <div>
            <div className="flex items-center gap-3">
              <h4 className="text-4xl font-bold text-brand-dark tracking-tighter">3</h4>
              <Badge className="bg-brand-yellow text-brand-dark border-none rounded-full px-3 py-0.5 text-[10px] font-bold">STABLE</Badge>
            </div>
            <p className="text-[9px] font-bold text-brand-dark/40 mt-1 uppercase tracking-wide">Active Inquiries</p>
          </div>
        </Card>
        <Card className="rounded-[2.2rem] border-none bg-brand-dark p-8 flex flex-col justify-between text-white shadow-2xl shadow-brand-dark/20 relative overflow-hidden">
          <p className="text-[9px] font-bold uppercase tracking-widest opacity-30 mb-10 relative z-10">System Sync</p>
          <div className="relative z-10">
            <h4 className="text-xl font-bold text-brand-yellow mb-1">May 21, 2026</h4>
            <p className="text-[9px] font-medium opacity-40 uppercase tracking-widest">Global LHDN Pulse</p>
          </div>
          <Activity className="absolute -right-8 -bottom-8 w-32 h-32 opacity-5" />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-[2rem] border-none bg-white p-10 shadow-sm">
          <h3 className="text-xl font-bold mb-8 tracking-tight">Cradle Entity Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-bg">
                  <th className="text-left py-4 text-[9px] font-bold uppercase tracking-widest text-brand-dark/30">Registry Entity</th>
                  <th className="text-center py-4 text-[9px] font-bold uppercase tracking-widest text-brand-dark/30">SSM</th>
                  <th className="text-center py-4 text-[9px] font-bold uppercase tracking-widest text-brand-dark/30">BNM</th>
                  <th className="text-center py-4 text-[9px] font-bold uppercase tracking-widest text-brand-dark/30">LHDN</th>
                  <th className="text-right py-4 text-[9px] font-bold uppercase tracking-widest text-brand-dark/30">Last Linkage</th>
                </tr>
              </thead>
              <tbody>
                {ecosystem.companies.map((company) => (
                  <tr key={company.id} className="border-b border-brand-bg last:border-none hover:bg-brand-bg/50 transition-all group">
                    <td className="py-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-10 h-10 rounded-xl shadow-sm border border-white group-hover:border-brand-yellow transition-all">
                          <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${company.id}`} />
                        </Avatar>
                        <div>
                          <p className="text-sm font-bold tracking-tight">{company.name}</p>
                          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-dark/30">{company.industry}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 text-center">
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${company.compliance?.ssm === 'VERIFIED' ? 'bg-green-50 text-green-600' : 'bg-brand-yellow/10 text-brand-dark'}`}>
                        {company.compliance?.ssm}
                      </span>
                    </td>
                    <td className="py-6 text-center">
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${company.compliance?.bnm === 'CLEARED' ? 'bg-blue-50 text-blue-600' : 'bg-brand-yellow/10 text-brand-dark'}`}>
                        {company.compliance?.bnm}
                      </span>
                    </td>
                    <td className="py-6 text-center">
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${company.compliance?.lhdn === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-brand-yellow/10 text-brand-dark'}`}>
                        {company.compliance?.lhdn}
                      </span>
                    </td>
                    <td className="py-6 text-right">
                      <p className="text-[9px] font-bold font-mono tracking-tighter opacity-40 group-hover:opacity-100 transition-opacity">{company.compliance?.lastAuditDate}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-8">
          <Card className="rounded-[2rem] border-none bg-white p-8 shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark/30 mb-6">Asset Class Linkages</h3>
            <div className="space-y-6">
              {[
                { sector: 'Fintech Logic', score: 94, trend: '+3.2%', color: 'bg-green-500' },
                { sector: 'Venture Ops', score: 98, trend: '+0.1%', color: 'bg-brand-dark' },
                { sector: 'Aero Systems', score: 82, trend: '-2.4%', color: 'bg-brand-yellow' },
                { sector: 'Logistics Matrix', score: 89, trend: '+1.5%', color: 'bg-green-500' },
                { sector: 'Digital Commerce', score: 76, trend: '-4.8%', color: 'bg-red-500' }
              ].map(s => (
                <div key={s.sector} className="space-y-2 pt-4 first:pt-0 border-t border-brand-bg first:border-none">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold tracking-tight text-brand-dark">{s.sector}</span>
                    <span className={`text-[9px] font-bold tracking-widest ${s.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {s.trend}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-brand-bg rounded-full overflow-hidden">
                    <div className={`h-full ${s.color}`} style={{ width: `${s.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function ComplianceAuditReport({ ecosystem }: { ecosystem: EcosystemData }) {
  return (
    <div className="space-y-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 px-2">
        <div>
          <Badge className="bg-orange-500 text-white mb-4 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[10px]">High Priority Analysis</Badge>
          <h1 className="text-5xl font-bold tracking-tighter mb-4 leading-tight">Compliance <span className="italic text-brand-dark/20 font-light">Ecosystem Trend</span></h1>
          <p className="text-brand-dark/40 text-xl font-medium max-w-2xl">Visualizing the 22% upward surge in SSM verification cycles across the Fintech node network.</p>
        </div>
        <div className="w-48 h-48 bg-white rounded-[3rem] shadow-xl flex items-center justify-center relative overflow-hidden border border-brand-bg">
           <div className="text-center relative z-10">
              <p className="text-4xl font-bold text-green-500 tracking-tighter">+22%</p>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-30">Market Delta</p>
           </div>
           <Activity className="absolute inset-0 w-full h-full text-green-500/5 -scale-x-100" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <Card className="lg:col-span-2 rounded-[3.5rem] border-none bg-white p-12 shadow-sm relative overflow-hidden">
            <h3 className="text-2xl font-bold mb-10 tracking-tight">Fintech Sector Verification Pulse</h3>
            <div className="h-[400px] flex items-end gap-4 pb-4">
               {[
                 { label: 'JAN', value: 45, color: 'bg-brand-bg' },
                 { label: 'FEB', value: 52, color: 'bg-brand-bg' },
                 { label: 'MAR', value: 68, color: 'bg-brand-bg' },
                 { label: 'APR', value: 82, color: 'bg-brand-yellow' },
                 { label: 'MAY', value: 94, color: 'bg-brand-dark' }
               ].map(bar => (
                 <div key={bar.label} className="flex-1 flex flex-col items-center gap-4">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${bar.value}%` }}
                      className={`w-full rounded-2xl ${bar.color} shadow-inner transition-all flex items-center justify-center`}
                    >
                      {bar.value > 80 && <CheckCircle2 className="text-white/40" size={24} />}
                    </motion.div>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">{bar.label}</span>
                 </div>
               ))}
            </div>
            <div className="absolute top-12 right-12 flex gap-4">
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-brand-dark" />
                  <span className="text-[10px] font-bold opacity-40 uppercase">Optimized</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-brand-yellow" />
                  <span className="text-[10px] font-bold opacity-40 uppercase">Active Sync</span>
               </div>
            </div>
         </Card>

         <div className="space-y-8">
            <Card className="rounded-[2.5rem] border-none bg-brand-dark text-white p-10 shadow-2xl shadow-brand-dark/20 relative overflow-hidden">
               <h4 className="text-xs font-bold uppercase tracking-widest text-brand-yellow mb-6">Top Performers</h4>
               <div className="space-y-6">
                  {ecosystem.companies.filter(c => c.compliance?.ssm === 'VERIFIED').slice(0, 3).map(c => (
                    <div key={c.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
                       <Avatar className="w-10 h-10 rounded-xl">
                          <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${c.id}`} />
                       </Avatar>
                       <div className="flex-1">
                          <p className="text-sm font-bold tracking-tight">{c.name}</p>
                          <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest">{c.stage}</p>
                       </div>
                    </div>
                  ))}
               </div>
               <Activity className="absolute -left-10 -bottom-10 w-48 h-48 opacity-5 text-brand-yellow" />
            </Card>

            <Card className="rounded-[2.5rem] border-none bg-white p-10 shadow-sm border border-brand-bg flex flex-col justify-center items-center text-center">
               <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
                  <BookOpen size={32} />
               </div>
               <h4 className="text-xl font-bold tracking-tight mb-2">Policy Node v2.1</h4>
               <p className="text-[11px] font-medium text-brand-dark/40 max-w-[200px] mb-6">Next iteration of programmable compliance units releases Q3.</p>
               <Button className="w-full rounded-2xl bg-brand-bg text-brand-dark hover:bg-brand-dark hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest h-12">View Documentation</Button>
            </Card>
         </div>
      </div>
    </div>
  );
}

function VelocityAuditReport({ ecosystem }: { ecosystem: EcosystemData }) {
  return (
    <div className="space-y-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 px-2">
        <div>
          <Badge className="bg-blue-500 text-white mb-4 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[10px]">Ecosystem Rocket Metrics</Badge>
          <h1 className="text-5xl font-bold tracking-tighter mb-4 leading-tight">Scale-up <span className="font-light text-brand-dark/30 underline decoration-brand-yellow decoration-4 underline-offset-8 transform -rotate-1 inline-block">Velocity</span></h1>
          <p className="text-brand-dark/40 text-xl font-medium max-w-2xl">Real-time analysis of the top 15% growth nodes exhibiting extreme ecosystem vitality and linkage activity.</p>
        </div>
        <div className="flex gap-4">
           <div className="w-32 h-32 bg-brand-dark rounded-3xl flex flex-col items-center justify-center text-brand-yellow shadow-2xl">
              <TrendingUp size={24} className="mb-2" />
              <span className="text-2xl font-bold">15%</span>
           </div>
           <div className="w-32 h-32 bg-white rounded-3xl flex flex-col items-center justify-center text-brand-dark shadow-sm border border-brand-bg">
              <Target size={24} className="mb-2 opacity-20" />
              <span className="text-2xl font-bold">A+</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { name: 'Aerodyne', velocity: 98, linkage: 12, trend: '+4.2%' },
          { name: 'Carsome', velocity: 94, linkage: 8, trend: '+2.8%' },
          { name: 'Grab', velocity: 99, linkage: 24, trend: '+0.5%' },
          { name: 'ZenPay', velocity: 88, linkage: 6, trend: '+12.4%' }
        ].map(node => (
          <Card key={node.name} className="rounded-[2.5rem] border-none bg-white p-8 shadow-sm group hover:bg-brand-dark hover:text-white transition-all overflow-hidden relative">
             <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                   <h3 className="text-2xl font-bold tracking-tighter">{node.name}</h3>
                   <Badge className="bg-green-500 text-white border-none text-[9px] font-bold px-2 py-0.5 rounded-md">{node.trend}</Badge>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-40">
                      <span>Velocity Score</span>
                      <span>{node.velocity}%</span>
                   </div>
                   <div className="w-full h-1.5 bg-brand-bg/50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${node.velocity}%` }}
                        className="h-full bg-brand-yellow" 
                      />
                   </div>
                </div>
                <div className="mt-8 flex items-center justify-between">
                   <div className="text-[10px] font-bold uppercase tracking-widest opacity-30">Active Linkages</div>
                   <div className="text-xl font-bold">{node.linkage}</div>
                </div>
             </div>
             <Sparkles className="absolute -right-6 -top-6 w-24 h-24 opacity-5 group-hover:opacity-10 group-hover:text-brand-yellow transition-all" />
          </Card>
        ))}
      </div>

      <Card className="rounded-[3rem] border-none bg-white p-12 shadow-sm relative overflow-hidden">
         <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/3">
               <h3 className="text-3xl font-bold tracking-tight mb-6">Growth Vector <span className="text-brand-yellow underline decoration-brand-dark/10 decoration-2 underline-offset-4">Logic</span></h3>
               <p className="text-brand-dark/50 text-sm leading-relaxed mb-10 font-medium">Linkage patterns show that nodes engaging in early mentorship-to-partner transitions exhibit 3.4x higher survival rates during Series B rounds.</p>
               <Button className="rounded-full bg-brand-dark text-brand-yellow px-10 h-14 font-bold text-xs uppercase tracking-widest shadow-xl shadow-brand-dark/20">Analyze My Node</Button>
            </div>
            <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
               {[1, 2, 3, 4, 5, 6].map(i => (
                 <div key={i} className="aspect-square bg-brand-bg rounded-3xl flex items-center justify-center p-6 hover:scale-105 transition-all group cursor-pointer relative overflow-hidden">
                    <div className="text-center z-10">
                       <p className="text-[9px] font-bold uppercase tracking-widest opacity-30 mb-2">Sector {i}</p>
                       <p className="text-xs font-bold text-brand-dark">Linkage {i * 12}</p>
                    </div>
                    <div className="absolute inset-0 bg-brand-yellow/0 group-hover:bg-brand-yellow/10 transition-colors" />
                 </div>
               ))}
            </div>
         </div>
      </Card>
    </div>
  );
}

function RiskAuditReport({ ecosystem }: { ecosystem: EcosystemData }) {
  return (
    <div className="space-y-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 px-2">
        <div>
          <Badge className="bg-red-500 text-white mb-4 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[10px]">Critical Security Protocol</Badge>
          <h1 className="text-5xl font-bold tracking-tighter mb-4 leading-tight">Risk <span className="text-red-500 italic font-medium">Alert</span> Matrix</h1>
          <p className="text-brand-dark/40 text-xl font-medium max-w-2xl">LHDN audit synchronization delays detected. System stability requires immediate node verification for sector: <span className="text-brand-dark font-bold underline decoration-red-500 underline-offset-4 decoration-2">SaaS / Retail</span>.</p>
        </div>
        <div className="flex gap-4">
           <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center animate-pulse">
              <Shield size={32} />
           </div>
           <div className="w-16 h-16 bg-brand-dark text-white rounded-2xl flex items-center justify-center">
              <Wrench size={32} />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-10">
            <Card className="rounded-[3rem] border-none bg-white p-10 shadow-sm border-l-8 border-red-500">
               <h3 className="text-2xl font-bold mb-8 tracking-tight flex items-center gap-3">
                  Affected Hub Nodes
                  <Badge variant="outline" className="border-red-100 text-red-500 bg-red-50">MANUAL ACTION REQUIRED</Badge>
               </h3>
               <div className="space-y-6">
                  {ecosystem.companies.filter(c => c.compliance?.lhdn === 'LATE' || c.compliance?.lhdn === 'AUDIT').map(company => (
                    <div key={company.id} className="flex items-center justify-between p-6 rounded-3xl bg-brand-bg transition-all hover:bg-white hover:shadow-lg border border-transparent hover:border-brand-bg">
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-2xl bg-white shadow-inner flex items-center justify-center">
                             <Avatar className="w-12 h-12 rounded-lg">
                                <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${company.id}`} />
                             </Avatar>
                          </div>
                          <div>
                             <p className="text-lg font-bold tracking-tight">{company.name}</p>
                             <p className="text-[10px] font-bold text-red-500/60 uppercase tracking-widest">{company.industry} • {company.compliance?.lhdn} STATUS</p>
                          </div>
                       </div>
                       <Button className="rounded-full bg-brand-dark text-white px-8 h-12 text-[10px] font-bold uppercase tracking-widest">Invoke Audit Sync</Button>
                    </div>
                  ))}
               </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <Card className="rounded-[2.5rem] border-none bg-brand-dark text-white p-10 relative overflow-hidden group">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-red-500 mb-6">Security Integrity</h4>
                  <div className="text-5xl font-bold mb-4 tracking-tighter">98.2%</div>
                  <p className="text-white/40 text-xs font-medium leading-relaxed">Infrastructure stability remains nominal despite regulatory node delays.</p>
                  <Activity className="absolute -right-8 -bottom-8 w-40 h-40 opacity-5 group-hover:scale-110 transition-transform" />
               </Card>
               <Card className="rounded-[2.5rem] border-none bg-white p-10 shadow-sm border border-brand-bg flex flex-col justify-between">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/30 mb-8">System Response</h4>
                    <p className="text-lg font-bold tracking-tight leading-tight mb-4">Cradle Ledger has isolated flagged packets.</p>
                  </div>
                  <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-green-500" />
                     <div className="w-3 h-3 rounded-full bg-green-500" />
                     <div className="w-3 h-3 rounded-full bg-brand-bg" />
                  </div>
               </Card>
            </div>
         </div>

         <div className="space-y-8">
            <Card className="rounded-[3rem] border-none bg-white p-10 shadow-sm border border-brand-bg">
               <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/30 mb-10">LHDN Protocol Checklist</h4>
               <div className="space-y-8">
                  {[
                    { label: 'Registry Reconciliation', status: 'COMPLETE', date: '02 MAY' },
                    { label: 'SaaS Sector Review', status: 'IN_PROGRESS', date: 'CURRENT' },
                    { label: 'Tax Token Emission', status: 'PENDING', date: 'EST. 20 MAY' },
                    { label: 'Final Ledger Sync', status: 'LOCKED', date: 'WAITING' }
                  ].map(step => (
                    <div key={step.label} className="flex gap-4">
                       <div className="shrink-0 flex flex-col items-center">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${step.status === 'COMPLETE' ? 'bg-green-500' : step.status === 'IN_PROGRESS' ? 'bg-brand-yellow' : 'bg-brand-bg'}`}>
                             {step.status === 'COMPLETE' && <CheckCircle2 size={12} className="text-white" />}
                          </div>
                          <div className="w-0.5 flex-1 bg-brand-bg my-1" />
                       </div>
                       <div className="pb-8">
                          <p className="text-sm font-bold tracking-tight mb-1">{step.label}</p>
                          <div className="flex items-center gap-2">
                             <span className="text-[9px] font-bold uppercase tracking-widest opacity-30">{step.date}</span>
                             <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${step.status === 'COMPLETE' ? 'text-green-500' : step.status === 'IN_PROGRESS' ? 'text-brand-dark' : 'text-brand-dark/20'}`}>{step.status}</span>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </Card>

            <Card className="rounded-[2.5rem] border-none bg-red-50 text-red-600 p-8 flex flex-col items-center text-center">
               <Activity size={32} className="mb-4" />
               <p className="text-[10px] font-bold uppercase tracking-widest mb-6">Contact Risk Specialist</p>
               <Button className="w-full rounded-2xl bg-red-600 text-white hover:bg-red-700 transition-all font-bold text-[10px] uppercase tracking-widest h-12 shadow-lg shadow-red-500/20">Open Secure Channel</Button>
            </Card>
         </div>
      </div>
    </div>
  );
}

function MentorAnalystReport({ ecosystem }: { ecosystem: EcosystemData }) {
  const activeMentors = ecosystem.mentors;
  
  return (
    <div className="space-y-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 px-2">
        <div>
          <Badge className="bg-brand-dark text-brand-yellow mb-4 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[10px]">Expert Network Analysis</Badge>
          <h1 className="text-5xl font-bold tracking-tighter mb-4 leading-tight">Mentor <span className="text-brand-yellow italic font-medium">Analyst</span> View</h1>
          <p className="text-brand-dark/40 text-xl font-medium max-w-2xl">Visualizing active guidance nodes and session efficacy across the Cradle ecosystem.</p>
        </div>
        <div className="flex gap-4">
           <Card className="bg-white p-6 rounded-2xl shadow-sm border border-brand-bg flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-yellow/10 text-brand-yellow rounded-xl flex items-center justify-center">
                 <Users size={24} />
              </div>
              <div>
                 <p className="text-2xl font-bold">{activeMentors.length}</p>
                 <p className="text-[10px] font-bold uppercase tracking-widest opacity-30">Active Nodes</p>
              </div>
           </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {activeMentors.map(mentor => (
           <Card key={mentor.id} className="rounded-[2.5rem] border-none bg-white p-8 shadow-sm group hover:shadow-xl transition-all border border-transparent hover:border-brand-bg">
              <div className="flex gap-6 items-start">
                 <div className="relative">
                    <Avatar className="w-20 h-20 rounded-2xl shadow-lg border-2 border-white">
                       <AvatarImage src={mentor.avatar} />
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center border-2 border-white text-white">
                       <CheckCircle2 size={16} />
                    </div>
                 </div>
                 <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                       <div>
                          <h3 className="text-2xl font-bold tracking-tight">{mentor.name}</h3>
                          <p className="text-xs font-bold text-brand-dark/40 uppercase tracking-widest">{mentor.role}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-3xl font-bold text-brand-dark tracking-tighter">Active</p>
                          <p className="text-[9px] font-bold uppercase tracking-widest opacity-30">Status</p>
                       </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                       {mentor.expertise?.map(exp => (
                         <Badge key={exp} variant="secondary" className="bg-brand-bg text-brand-dark border-none text-[9px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">
                            {exp}
                         </Badge>
                       ))}
                    </div>
                 </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-brand-bg">
                 <div className="text-center">
                    <p className="text-lg font-bold">12</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest opacity-30">Sessions</p>
                 </div>
                 <div className="text-center border-x border-brand-bg">
                    <p className="text-lg font-bold">96%</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest opacity-30">Satisfaction</p>
                 </div>
                 <div className="text-center">
                    <p className="text-lg font-bold">+18%</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest opacity-30">Impact Delta</p>
                 </div>
              </div>

              <div className="mt-8 flex gap-3">
                 <Button className="flex-1 rounded-2xl bg-brand-dark text-white text-[10px] uppercase font-bold tracking-widest h-12">View History</Button>
                 <Button variant="outline" className="rounded-2xl border-brand-dark/10 text-[10px] uppercase font-bold tracking-widest h-12">Contact</Button>
              </div>
           </Card>
         ))}
      </div>

      <Card className="rounded-[3rem] border-none bg-brand-dark text-white p-12 relative overflow-hidden">
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="max-w-md">
               <h3 className="text-3xl font-bold mb-4 tracking-tight">Mentorship <span className="text-brand-yellow">Efficacy</span> Engine</h3>
               <p className="opacity-40 text-sm leading-relaxed mb-8">Our AI analyzes session transcripts to provide objective qualitative insights and skill transfer metrics between mentors and founders.</p>
               <Button className="bg-brand-yellow text-brand-dark rounded-full px-10 h-14 font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform">Configure Efficacy Rules</Button>
            </div>
            <div className="flex -space-x-10">
               {[1, 2, 3, 4, 5].map(i => (
                 <div key={i} className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center p-2 backdrop-blur-md">
                    <div className="w-full h-full rounded-full bg-brand-yellow" style={{ opacity: i * 0.2 }} />
                 </div>
               ))}
            </div>
         </div>
         <Activity className="absolute -left-20 -top-20 w-80 h-80 opacity-5" />
      </Card>
    </div>
  );
}
