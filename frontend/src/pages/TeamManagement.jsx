import React, { useState } from 'react';
import { ArrowLeft, Plus, MoveHorizontal as MoreHorizontal } from 'lucide-react';
import InviteTeamMemberPopup from './InviteTeamMemberPopup';

const teamMembers = [
  { name: 'Krishna Singh', email: 'krishna@example.com', role: 'Owner', joined: 'May 10, 2024', initials: 'KS', color: 'bg-primary' },
  { name: 'John Doe', email: 'john@example.com', role: 'Editor', joined: 'May 12, 2024', initials: 'JD', color: 'bg-success' },
  { name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Viewer', joined: 'May 13, 2024', initials: 'SJ', color: 'bg-warning' },
  { name: 'Emily Davis', email: 'emily@example.com', role: 'Editor', joined: 'May 13, 2024', initials: 'ED', color: 'bg-purple-500' },
  { name: 'Michael Brown', email: 'michael@example.com', role: 'Viewer', joined: 'May 14, 2024', initials: 'MB', color: 'bg-blue-500' },
  { name: 'Alex Chen', email: 'alex@example.com', role: 'Viewer', joined: 'May 15, 2024', initials: 'AC', color: 'bg-amber-500' },
  { name: 'Lisa Wang', email: 'lisa@example.com', role: 'Editor', joined: 'May 16, 2024', initials: 'LW', color: 'bg-pink-500' },
  { name: 'David Kim', email: 'david@example.com', role: 'Viewer', joined: 'May 17, 2024', initials: 'DK', color: 'bg-teal-500' },
];

export default function TeamManagement({ onBack }) {
  const [showInvite, setShowInvite] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="p-2 text-text-secondary hover:text-text-primary hover:bg-dark-card-2 rounded-lg transition-colors">
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-xl font-semibold text-text-primary">Team Management</h1>
          </div>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Invite Member
        </button>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border">
              <th className="text-left text-xs text-text-muted font-medium px-4 py-3">Member</th>
              <th className="text-left text-xs text-text-muted font-medium px-4 py-3">Email</th>
              <th className="text-left text-xs text-text-muted font-medium px-4 py-3">Role</th>
              <th className="text-left text-xs text-text-muted font-medium px-4 py-3">Joined At</th>
              <th className="text-left text-xs text-text-muted font-medium px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member, i) => (
              <tr key={i} className="border-b border-dark-border/50 hover:bg-dark-card-2/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${member.color} rounded-full flex items-center justify-center text-white font-semibold text-xs`}>
                      {member.initials}
                    </div>
                    <span className="text-sm text-text-primary font-medium">{member.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-text-secondary">{member.email}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    member.role === 'Owner' ? 'bg-primary/10 text-primary' :
                    member.role === 'Editor' ? 'bg-success/10 text-success' :
                    'bg-warning/10 text-warning'
                  }`}>
                    {member.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-text-secondary">{member.joined}</span>
                </td>
                <td className="px-4 py-3">
                  <button className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showInvite && <InviteTeamMemberPopup onClose={() => setShowInvite(false)} />}
    </div>
  );
}
