/*
* PURPOSE:
* This component serves as the complete login and multi-step signup page. 
* Includes all the dynamic logic for collecting user and child information.
*
*/
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, AuthError } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { auth, db } from '../firebase';
import { useAuth } from '@/context/AuthContext';
import { User as UserIcon, Users, ArrowRight, ArrowLeft, Plus, Minus } from 'lucide-react';
import { UserProfile, KidProfile, UserType } from '@/types/User';
import Header from '@/components/Header'; // We'll need a basic header here


// --- CONSTANTS ---
const canadianProvinces = [
    "Alberta", "British Columbia", "Manitoba", "New Brunswick", 
    "Newfoundland and Labrador", "Nova Scotia", "Ontario", "Prince Edward Island", 
    "Quebec", "Saskatchewan", "Northwest Territories", "Nunavut", "Yukon"
];

// --- Helper Component for the Progress Stepper ---
const ProgressStepper = ({ currentStep }: { currentStep: number }) => {
    const steps = ['Account Info', 'Your Details'];
    return (
        <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = currentStep === stepNumber;
                const isCompleted = currentStep > stepNumber;
                return (
                    <React.Fragment key={step}>
                        <div className="flex flex-col items-center text-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 font-bold ${isActive ? 'bg-[#00524C] text-[#FFFBEB]' : isCompleted ? 'bg-[#ACDB95] text-[#00524C]' : 'bg-[#ACDB95]/30 text-[#00524C]/70'}`}>
                                {isCompleted ? '✓' : stepNumber}
                            </div>
                            <p className={`mt-2 text-xs font-semibold ${isActive || isCompleted ? 'text-[#00524C]' : 'text-[#00524C]/70'}`}>{step}</p>
                        </div>
                        {index < steps.length - 1 && <div className={`flex-auto h-1 mx-2 transition-all duration-300 rounded-full ${isCompleted ? 'bg-[#ACDB95]' : 'bg-[#ACDB95]/30'}`}></div>}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

// --- Helper Component for Selecting Interest Tags ---
const TagSelector = ({ selectedTags, onTagToggle }: { selectedTags: string[], onTagToggle: (tag: string) => void }) => {
    const interestTags = ["Cycling", "STEAM", "Minecraft", "Arts", "Drawing", "Music", "Sports", "Coding", "Nature", "Theater"];
    return (
        <div className="flex flex-wrap gap-2">
            {interestTags.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                    <button type="button" key={tag} onClick={() => onTagToggle(tag)}
                        className={`px-3 py-1 text-sm rounded-full transition-all duration-200 font-semibold ${isSelected ? 'bg-[#00524C] text-[#FFFBEB] shadow-md' : 'bg-[#ACDB95]/50 text-[#00524C] hover:bg-[#ACDB95]/80'}`}>
                        {tag}
                    </button>
                );
            })}
        </div>
    );
};

// --- Helper Component for the Number of Kids Stepper ---
const NumberStepper = ({ value, onChange }: { value: number, onChange: (newValue: number) => void }) => {
    return (
        <div className="flex items-center gap-2">
            <Button type="button" variant="outline" className="border-[#ACDB95] text-[#00524C] hover:bg-[#ACDB95]/50" size="icon" onClick={() => onChange(Math.max(0, value - 1))}><Minus className="h-4 w-4" /></Button>
            <Input className="text-center w-16 bg-white border-[#ACDB95] text-[#00524C] focus-visible:ring-[#00524C]" type="text" value={value} readOnly />
            <Button type="button" variant="outline" className="border-[#ACDB95] text-[#00524C] hover:bg-[#ACDB95]/50" size="icon" onClick={() => onChange(value + 1)}><Plus className="h-4 w-4" /></Button>
        </div>
    );
};

export default function AuthPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [isLoginView, setIsLoginView] = useState(true);
  const [signupStep, setSignupStep] = useState(1);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [lookingFor, setLookingFor] = useState({ parent: false, self: false });
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [personalInterests, setPersonalInterests] = useState<string[]>([]);
  const [children, setChildren] = useState<KidProfile[]>([]);

  // UI State
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleLookingForChange = (type: 'parent' | 'self') => {
    const newLookingFor = { ...lookingFor, [type]: !lookingFor[type] };
    setLookingFor(newLookingFor);
    if (newLookingFor.parent && children.length === 0) {
        setChildren([{ name: '', age: '', interests: [] }]);
    } else if (!newLookingFor.parent) {
        setChildren([]);
    }
  };

  const handleChildChange = (index: number, field: keyof KidProfile, value: string | string[]) => {
    const newChildren = [...children];
    (newChildren[index] as any)[field] = value;
    setChildren(newChildren);
  };
  
  const handleChildInterestToggle = (childIndex: number, tag: string) => {
    const newChildren = [...children];
    const currentInterests = newChildren[childIndex].interests;
    const newInterests = currentInterests.includes(tag) ? currentInterests.filter(i => i !== tag) : [...currentInterests, tag];
    newChildren[childIndex].interests = newInterests;
    setChildren(newChildren);
  };

  const handlePersonalInterestToggle = (tag: string) => {
    setPersonalInterests(prev => prev.includes(tag) ? prev.filter(i => i !== tag) : [...prev, tag]);
  };

  const handleNumKidsChange = (count: number) => {
    const currentCount = children.length;
    if (count > currentCount) {
      const newKids = Array(count - currentCount).fill(0).map(() => ({ name: '', age: '', interests: [] }));
      setChildren(prev => [...prev, ...newKids]);
    } else if (count < currentCount) {
      setChildren(prev => prev.slice(0, count));
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    if (password !== confirmPassword) return setError("Passwords do not match.");
    if (password.length < 6) return setError("Password must be at least 6 characters long.");
    if (!lookingFor.parent && !lookingFor.self) return setError("Please select at least one option.");
    setSignupStep(2);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(null);
    try { 
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/'); // Redirect on successful login
    } 
    catch (err) { setError((err as AuthError).message.replace('Firebase: ', '')); } 
    finally { setLoading(false); }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(null);
    if (!city || !province) { setLoading(false); return setError("Please provide your location information."); }
    
    // Determine user roles
    const roles: UserType[] = [];
    if (lookingFor.parent) roles.push('parent');
    if (lookingFor.self) roles.push('soloCamper');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userProfile: UserProfile = {
        userId: user.uid,
        email: user.email!,
        roles,
        firstName, lastName,
        location: { city, province },
        personalInterests: lookingFor.self ? personalInterests : [],
        children: lookingFor.parent ? children.filter(c => c.name && c.age) : [],
        createdAt: new Date().toISOString(),
      };

      // Save the complete profile to Firestore
      await setDoc(doc(db, "users", user.uid), userProfile);
      
      router.push('/'); // Redirect on successful signup
    } catch (err) {
      setError((err as AuthError).message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };
  
  const commonInputStyles = "bg-white border-[#ACDB95] text-[#00524C] focus:border-[#00524C] focus:ring-[#00524C]";

  // Since this is a standalone page, we render a simplified header
  // A more advanced implementation might use a Layout component
  return (
    <div className="min-h-screen bg-[#FFFBEB] text-[#00524C]">
        {/* We can't use the full header here as it would cause prop issues, so this is a placeholder */}
        <header className="sticky top-0 z-50 w-full border-b border-[#ACDB95]/50 bg-[#FFFBEB]/80 backdrop-blur">
             <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
                <a href="/" className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-[#00524C] to-[#ACDB95]"><span className="font-bold text-lg text-[#FFFBEB]">F</span></div>
                    <span className="font-bold text-lg">FindMyCamps</span>
                </a>
            </div>
        </header>

        <main className="flex items-center justify-center mt-8 md:mt-16 p-4">
            <div className="w-full max-w-2xl p-8 space-y-6 bg-[#FFFBEB] border border-[#ACDB95] rounded-lg shadow-lg">
                {!isLoginView && <ProgressStepper currentStep={signupStep} />}
                {error && <div className="p-3 text-center text-sm text-red-700 bg-red-100 border border-red-300 rounded-md animate-shake">{error}</div>}
                
                {isLoginView ? (
                    // Login View
                    <div className="animate-fade-in"><div className="text-center mb-6"><h1 className="text-3xl font-bold text-[#00524C]">Welcome Back!</h1><p className="text-[#00524C]/80">Log in to find your next adventure.</p></div><form onSubmit={handleLogin} className="space-y-4"><div><label htmlFor="email" className="font-medium">Email</label><Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className={commonInputStyles}/></div><div><label htmlFor="password">Password</label><Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className={commonInputStyles}/></div><Button type="submit" className="w-full bg-[#00524C] text-[#FFFBEB] hover:bg-[#00524C]/90 font-semibold" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button></form></div>
                ) : signupStep === 1 ? (
                    // Signup Step 1
                    <div className="animate-fade-in"><form onSubmit={handleNextStep} className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label htmlFor="firstName" className="font-medium">First Name</label><Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className={commonInputStyles}/></div><div><label htmlFor="lastName" className="font-medium">Last Name</label><Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required className={commonInputStyles}/></div></div><div><label htmlFor="email-signup" className="font-medium">Email</label><Input id="email-signup" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={commonInputStyles}/></div><div><label htmlFor="password-signup" className="font-medium">Password</label><Input id="password-signup" type="password" placeholder="6+ characters" value={password} onChange={(e) => setPassword(e.target.value)} required className={commonInputStyles}/></div><div><label htmlFor="confirm-password" className="font-medium">Confirm Password</label><Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={commonInputStyles}/></div><div><label className="font-medium text-center block mb-3">What are you looking for?</label><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div onClick={() => handleLookingForChange('parent')} className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${lookingFor.parent ? 'border-[#00524C] bg-[#ACDB95]/30' : 'border-[#ACDB95] hover:border-[#00524C]'}`}><Users className="mx-auto h-8 w-8 mb-2 text-[#00524C]" /><p className="text-center font-semibold">For my child(ren)</p><p className="text-center text-xs text-[#00524C]/80">I'm a parent or guardian.</p></div><div onClick={() => handleLookingForChange('self')} className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${lookingFor.self ? 'border-[#00524C] bg-[#ACDB95]/30' : 'border-[#ACDB95] hover:border-[#00524C]'}`}><UserIcon className="mx-auto h-8 w-8 mb-2 text-[#00524C]" /><p className="text-center font-semibold">For myself</p><p className="text-center text-xs text-[#00524C]/80">I'm looking for camps.</p></div></div></div><Button type="submit" className="w-full bg-[#00524C] text-[#FFFBEB] hover:bg-[#00524C]/90 font-semibold">Next <ArrowRight className="ml-2 h-4 w-4" /></Button></form></div>
                ) : (
                    // Signup Step 2
                    <div className="animate-fade-in">
                        <form onSubmit={handleFinalSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="city" className="font-medium">City</label>
                                    <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required className={commonInputStyles} />
                                </div>
                                <div>
                                    <label htmlFor="province" className="font-medium">Province</label>
                                    <Select onValueChange={setProvince} value={province}>
                                        <SelectTrigger id="province" className={commonInputStyles}>
                                            <SelectValue placeholder="Select province" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white text-[#00524C]">{canadianProvinces.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select>
                                </div>
                            </div>
                            <div className="space-y-6">{lookingFor.self && 
                                (<div className="space-y-4 p-4 border border-[#ACDB95] rounded-lg bg-[#FFFBEB] animate-fade-in">
                                    <h3 className="font-semibold flex items-center gap-2"><UserIcon className="h-5 w-5 text-[#00524C]"/> Your Personal Interests</h3>
                                    <TagSelector selectedTags={personalInterests} onTagToggle={handlePersonalInterestToggle} />
                                </div>)}
                                {lookingFor.parent && 
                                    (<div className="space-y-4 p-4 border border-[#ACDB95] rounded-lg bg-[#FFFBEB] animate-fade-in">
                                        <h3 className="font-semibold flex items-center gap-2"><Users className="h-5 w-5 text-[#00524C]"/> Your Child(ren)'s Details</h3>
                                        <div>
                                            <label htmlFor="numKids" className="text-sm font-medium">Number of Kids</label>
                                            <div className="mt-1"><NumberStepper value={children.length} onChange={handleNumKidsChange} /></div>
                                        </div>
                                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                            {children.map((child, index) => 
                                                (<div key={index} className="p-3 border border-[#ACDB95]/50 rounded-md space-y-3 bg-[#FFFBEB] animate-fade-in-slide">
                                                    <h4 className="font-semibold text-sm">Child {index + 1}</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div>
                                                            <label htmlFor={`childName${index}`} className="text-xs font-medium">Name</label>
                                                            <Input id={`childName${index}`} value={child.name} onChange={(e) => handleChildChange(index, 'name', e.target.value)} required className={commonInputStyles}/>
                                                        </div>
                                                        <div>
                                                            <label htmlFor={`childAge${index}`} className="text-xs font-medium">Age</label>
                                                            <Input id={`childAge${index}`} type="number" min="0" value={child.age} onChange={(e) => handleChildChange(index, 'age', e.target.value)} required className={commonInputStyles}/>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-medium">Interests</label>
                                                        <TagSelector selectedTags={child.interests} onTagToggle={(tag) => handleChildInterestToggle(index, tag)} />
                                                    </div>
                                                </div>)
                                            )}
                                        </div>
                                    </div>)
                                }
                            </div>
                            <div className="flex justify-between items-center">
                                <Button variant="ghost" className="text-[#00524C] hover:bg-[#ACDB95]/30" onClick={() => setSignupStep(1)}>
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back</Button><Button type="submit" className="bg-[#00524C] text-[#FFFBEB] hover:bg-[#00524C]/90 font-semibold" disabled={loading}>{loading ? 'Creating Account...' : 'Sign Up'}</Button>
                            </div>
                        </form>
                    </div>
                )}
                
                <div className="text-center pt-4">
                    <button 
                        onClick={() => { 
                        setIsLoginView(!isLoginView); 
                        setError(null); 
                        setSignupStep(1); 
                        }} 
                        className="text-sm text-[#00524C] font-semibold"
                    >
                        {isLoginView ? (
                        <span>
                            Don't have an account? <span className="underline transition-opacity hover:opacity-80">Sign Up</span>
                        </span>
                        ) : (
                        <span>
                            Already have an account? <span className="underline transition-opacity hover:opacity-80">Login</span>
                        </span>
                        )}
                    </button>
                </div>
            </div>
        </main>
    </div>
  );
}
