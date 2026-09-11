import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingBag, Store, ArrowRight } from 'lucide-react';

const SelectRole = () => {
  const { user, setUserRole } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleRoleSelect = (role: 'buyer' | 'seller') => {
    setUserRole(role);
    navigate(role === 'seller' ? '/seller' : '/buyer');
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl gradient-primary shadow-glow mb-4">
            <span className="text-primary-foreground font-bold text-xl md:text-2xl">U</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Welcome, {user?.name}!
          </h1>
          <p className="text-muted-foreground text-base md:text-lg px-4">
            How would you like to use UniSwap?
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 px-2 sm:px-0">
          {/* Buyer Card */}
          <button
            onClick={() => handleRoleSelect('buyer')}
            className="group flex flex-col items-center p-6 md:p-8 rounded-2xl bg-card border border-border/50 shadow-card hover:shadow-hover hover:border-accent/50 transition-all duration-300 animate-fade-in"
            style={{ animationDelay: '100ms' }}
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-accent/20 flex items-center justify-center mb-4 group-hover:bg-accent/30 transition-colors">
              <ShoppingBag className="h-8 w-8 md:h-10 md:w-10 text-accent" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">I want to Rent</h3>
            <p className="text-sm text-muted-foreground text-center mb-4 px-2">
              Browse and rent items from fellow students. Save money on things you only need temporarily.
            </p>
            <div className="flex items-center gap-2 text-primary font-medium">
              <span>Continue as Buyer</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Seller Card */}
          <button
            onClick={() => handleRoleSelect('seller')}
            className="group flex flex-col items-center p-6 md:p-8 rounded-2xl bg-card border border-border/50 shadow-card hover:shadow-hover hover:border-primary/50 transition-all duration-300 animate-fade-in"
            style={{ animationDelay: '200ms' }}
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Store className="h-8 w-8 md:h-10 md:w-10 text-primary" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">I want to Lend</h3>
            <p className="text-sm text-muted-foreground text-center mb-4 px-2">
              List your items for rent and earn money. Help other students while making extra income.
            </p>
            <div className="flex items-center gap-2 text-primary font-medium">
              <span>Continue as Seller</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        <p className="text-center text-xs md:text-sm text-muted-foreground mt-6 md:mt-8 px-4">
          You can change your role anytime from settings
        </p>
      </div>
    </div>
  );
};

export default SelectRole;
