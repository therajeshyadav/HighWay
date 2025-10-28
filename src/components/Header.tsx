import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HeaderProps {
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
}

const Header = ({ searchPlaceholder = "Search experiences", onSearch }: HeaderProps) => {

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <header className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-foreground text-background p-2 rounded-lg">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none">highway</span>
              <span className="font-bold text-lg leading-none">delite</span>
            </div>
          </Link>
          
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl">
            <div className="relative">
              <Input
                type="text"
                name="search"
                placeholder={searchPlaceholder}
                className="pr-24"
              />
              <Button 
                type="submit"
                className="absolute right-0 top-0 rounded-l-none"
              >
                Search
              </Button>
            </div>
          </form>


        </div>
      </div>
    </header>
  );
};

export default Header;
