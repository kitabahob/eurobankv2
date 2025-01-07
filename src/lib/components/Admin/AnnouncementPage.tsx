'use client';
import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Announcement {
  id: number;
  title: string;
  description: string;
  timestamp: string;
}

interface NewAnnouncement {
  title: string;
  description: string;
}

const AnnouncementPage: React.FC = () => {
  const supabase = createClient();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState<NewAnnouncement>({ title: '', description: '' });

  useEffect(() => {
    const fetchAnnouncementData = async () => {
      try {
        const { data, error } = await supabase
          .from('announcement')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) {
          console.error('Error fetching announcements:', error);
        } else {
          setAnnouncements(data || []);
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };
    fetchAnnouncementData();
  }, [supabase]);

  const insertAnnouncementData = async () => {
    try {
      const { data, error } = await supabase
        .from('announcement')
        .insert([{ title: newAnnouncement.title, description: newAnnouncement.description }]);
      if (error) {
        console.error('Error inserting announcement:', error);
      } else {
        setAnnouncements([...announcements, ...(data || [])]);
        setNewAnnouncement({ title: '', description: '' });
      }
    } catch (error) {
      console.error('Error inserting announcement:', error);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newAnnouncement.title && newAnnouncement.description) {
      insertAnnouncementData();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setNewAnnouncement((prev) => ({ ...prev, [id]: value }));
  };

  const handleAction = async (id: number, action: 'delete' | 'edit') => {
    const confirmationMessage = action === 'delete' 
      ? 'Are you sure you want to delete this announcement?' 
      : 'Are you sure you want to edit this announcement?';
    
    if (window.confirm(confirmationMessage)) {
      if (action === 'delete') {
        try {
          const { error } = await supabase.from('announcement').delete().eq('id', id);
          if (error) {
            console.error('Error deleting announcement:', error);
          } else {
            setAnnouncements((prev) => prev.filter((announcement) => announcement.id !== id));
          }
        } catch (error) {
          console.error('Error deleting announcement:', error);
        }
      } else if (action === 'edit') {
        alert('Edit functionality is not implemented yet.'); // Placeholder for edit functionality
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Post New Announcement</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-400">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={newAnnouncement.title}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white
                focus:border-blue-500 focus:ring-blue-500 p-2"
              placeholder="Enter announcement title"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-400">
              Description
            </label>
            <textarea
              id="description"
              value={newAnnouncement.description}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white
                focus:border-blue-500 focus:ring-blue-500 p-2"
              placeholder="Enter announcement details"
            />
          </div>
          <button
            type="submit"
            className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md 
              hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Post Announcement
          </button>
        </form>
      </div>

      <div className="bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Recent Announcements</h2>
        </div>
        <div className="divide-y divide-gray-700">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-white">{announcement.title}</h3>
                <div className="space-x-2">
                  <button
                    onClick={() => handleAction(announcement.id, 'edit')}
                    className="text-yellow-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleAction(announcement.id, 'delete')}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-gray-300">{announcement.description}</p>
              <span className="text-sm text-gray-400">
                {new Date(announcement.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementPage;
