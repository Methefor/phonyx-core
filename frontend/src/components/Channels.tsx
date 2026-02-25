import React, { useState } from 'react';
import '../styles/Channels.css';

interface Channel {
  id: string;
  name: string;
}

interface ChannelsProps {
  selectedChannelId: string;
  onSelectChannel: (channelId: string) => void;
}

const Channels: React.FC<ChannelsProps> = ({ selectedChannelId, onSelectChannel }) => {
  const [channels] = useState<Channel[]>([
    { id: '1', name: 'general' },
    { id: '2', name: 'random' },
    { id: '3', name: 'announcements' }
  ]);

  return (
    <div className="channels-container">
      <h3>Channels</h3>
      <div className="channels-list">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className={`channel-item ${selectedChannelId === channel.id ? 'active' : ''}`}
            onClick={() => onSelectChannel(channel.id)}
          >
            # {channel.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Channels;
