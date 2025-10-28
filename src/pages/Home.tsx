import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ExperienceCard from "@/components/ExperienceCard";
import { apiService, Experience } from "@/services/api";

const Home = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getExperiences();
      setExperiences(data);
      setFilteredExperiences(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load experiences. Please try again later.';
      setError(errorMessage);
      console.error('Error fetching experiences:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredExperiences(experiences);
      return;
    }

    const filtered = experiences.filter(exp =>
      exp.title.toLowerCase().includes(query.toLowerCase()) ||
      exp.location.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredExperiences(filtered);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />

      <main className="container mx-auto px-4 py-8">
        {loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading experiences...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchExperiences}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredExperiences.map((experience) => (
                <ExperienceCard key={experience.id} experience={experience} />
              ))}
            </div>

            {filteredExperiences.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No experiences found matching your search.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
