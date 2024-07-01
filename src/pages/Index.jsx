import React, { useEffect, useState } from 'react';

const Index = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        const storyIds = await response.json();
        const topStoryIds = storyIds.slice(0, 10); // Fetch top 10 stories for simplicity

        const storyPromises = topStoryIds.map(id =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
        );

        const stories = await Promise.all(storyPromises);
        setStories(stories);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopStories();
  }, []);

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="h-screen w-screen flex items-center justify-center">Error: {error.message}</div>;
  }

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl mb-4">Top Hacker News Stories</h1>
      <ul className="space-y-2">
        {stories.map(story => (
          <li key={story.id} className="text-lg">
            <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {story.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Index;