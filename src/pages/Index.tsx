import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Repeat, DollarSign, Users } from 'lucide-react';

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role) {
        navigate(user.role === 'seller' ? '/seller' : '/buyer');
      } else {
        navigate('/select-role');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const features = [
    {
      icon: Repeat,
      title: 'Rent & Share',
      description: 'Borrow items you need temporarily instead of buying expensive things for one-time use.',
    },
    {
      icon: DollarSign,
      title: 'Earn Money',
      description: 'List your unused items and earn passive income from fellow students.',
    },
    {
      icon: Users,
      title: 'Campus Community',
      description: 'Connect with students from your campus. Safe, trusted, and convenient.',
    },
  ];

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <span className="text-primary-foreground font-bold text-lg">U</span>
          </div>
          <span className="text-xl font-bold text-foreground">UniSwap</span>
        </div>
        <Button variant="gradient" onClick={() => navigate('/auth')}>
          Get Started
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
            Campus{' '}
            <span className="text-primary">Micro-Rental</span>
            <br />
            Platform
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
            Rent books, lab equipment, and more from fellow students. 
            Save money. Earn extra. Build community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="gradient" 
              size="xl"
              onClick={() => navigate('/auth')}
              className="shadow-glow"
            >
              Start Renting
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="xl"
              onClick={() => navigate('/auth')}
            >
              List Your Items
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-24">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="p-8 rounded-2xl bg-card border border-border/50 shadow-card hover:shadow-glow hover:-translate-y-1 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-24 p-8 rounded-2xl bg-card border border-border/50 shadow-card">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary">500+</p>
              <p className="text-muted-foreground mt-1">Active Users</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary">1,200+</p>
              <p className="text-muted-foreground mt-1">Items Listed</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary">₹50K+</p>
              <p className="text-muted-foreground mt-1">Saved by Students</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary">15+</p>
              <p className="text-muted-foreground mt-1">Campuses</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t border-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 UniSwap. Built for students, by students.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
