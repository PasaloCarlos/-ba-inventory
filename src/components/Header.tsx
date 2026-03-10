import { supabase } from '../lib/supabase';

interface HeaderProps {
  totalValue: number;
}

export default function Header({ totalValue }: HeaderProps) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="header">
      <div className="header-left">
        <img src={import.meta.env.BASE_URL + 'logo.png'} alt="Braided by Aliyah" className="header-logo" />
        <span className="header-location">Humacao</span>
      </div>
      <div className="header-right">
        <div className="total-value">
          <span className="total-label">Total Inventory</span>
          <span className="total-amount">${totalValue.toFixed(2)}</span>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </header>
  );
}
