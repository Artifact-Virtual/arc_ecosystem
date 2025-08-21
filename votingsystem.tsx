import React, { useState } from 'react';
import { Vote, Plus, Users, Clock, CheckCircle, XCircle, Hash, Calendar, Shield, Zap } from 'lucide-react';
import baseLogo from './logo/base-logo.png'; // Add your Base logo to logo/base-logo.png

interface VoteRecord {
  id: string;
  voter: string;
  choice: 'yes' | 'no';
  timestamp: Date;
  blockHash: string;
  blockHeight: number;
  gasUsed: number;
}

interface Proposal {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  createdBy: string;
  endTime: Date;
  votes: VoteRecord[];
  status: 'active' | 'ended';
  category: string;
  requiredQuorum: number;
}

const BlockchainVoting: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: '1',
      title: 'Implement Carbon Neutral Protocol',
      description: 'Should we allocate 25% of treasury funds to carbon offset initiatives and renewable energy partnerships?',
      createdAt: new Date(Date.now() - 86400000),
      createdBy: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
      endTime: new Date(Date.now() + 172800000),
      votes: [
        {
          id: '1',
          voter: '0x8ba1f109551bD432803012645Hac189451b934',
          choice: 'yes',
          timestamp: new Date(Date.now() - 3600000),
          blockHash: '0x1a2b3c4d5e6f789012345678901234567890abcd',
          blockHeight: 18420156,
          gasUsed: 21000
        },
        {
          id: '2',
          voter: '0x9f8e7d6c5b4a321098765432109876543210fedc',
          choice: 'no',
          timestamp: new Date(Date.now() - 1800000),
          blockHash: '0x9f8e7d6c5b4a321098765432109876543210fedc',
          blockHeight: 18420189,
          gasUsed: 21000
        },
        {
          id: '3',
          voter: '0x5c3a2b1d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b',
          choice: 'yes',
          timestamp: new Date(Date.now() - 900000),
          blockHash: '0x5c3a2b1d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b',
          blockHeight: 18420201,
          gasUsed: 21000
        }
      ],
      status: 'active',
      category: 'Treasury',
      requiredQuorum: 100
    },
    {
      id: '2',
      title: 'Upgrade Smart Contract Infrastructure',
      description: 'Proposal to upgrade our core smart contracts to the latest version with enhanced security features and gas optimization.',
      createdAt: new Date(Date.now() - 259200000),
      createdBy: '0x123abc456def789012345678901234567890abcd',
      endTime: new Date(Date.now() - 86400000),
      votes: [
        {
          id: '4',
          voter: '0x8ba1f109551bD432803012645Hac189451b934',
          choice: 'yes',
          timestamp: new Date(Date.now() - 172800000),
          blockHash: '0x8ba1f109551bD432803012645Hac189451b934',
          blockHeight: 18419876,
          gasUsed: 21000
        },
        {
          id: '5',
          voter: '0x9f8e7d6c5b4a321098765432109876543210fedc',
          choice: 'yes',
          timestamp: new Date(Date.now() - 129600000),
          blockHash: '0x9f8e7d6c5b4a321098765432109876543210fedc',
          blockHeight: 18419923,
          gasUsed: 21000
        }
      ],
      status: 'ended',
      category: 'Technical',
      requiredQuorum: 50
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    duration: '48',
    category: 'General',
    requiredQuorum: '100'
  });

  const [userAddress] = useState('0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4');
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [currentBlockHeight] = useState(18420234);

  const generateBlockHash = () => {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 40; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  };

  const getCurrentBlockHeight = () => {
    return currentBlockHeight + Math.floor(Math.random() * 10);
  };

  const createProposal = () => {
    if (!newProposal.title.trim() || !newProposal.description.trim()) return;

    const proposal: Proposal = {
      id: Date.now().toString(),
      title: newProposal.title,
      description: newProposal.description,
      createdAt: new Date(),
      createdBy: userAddress,
      endTime: new Date(Date.now() + parseInt(newProposal.duration) * 3600000),
      votes: [],
      status: 'active',
      category: newProposal.category,
      requiredQuorum: parseInt(newProposal.requiredQuorum)
    };

    setProposals([proposal, ...proposals]);
    setNewProposal({ title: '', description: '', duration: '48', category: 'General', requiredQuorum: '100' });
    setShowCreateForm(false);
  };

  const castVote = (proposalId: string, choice: 'yes' | 'no') => {
    const proposal = proposals.find(p => p.id === proposalId);
    if (!proposal || !isProposalActive(proposal)) return;

    const hasVoted = proposal.votes.some(v => v.voter === userAddress);
    if (hasVoted) {
      alert('You have already voted on this proposal!');
      return;
    }

    const voteRecord: VoteRecord = {
      id: Date.now().toString(),
      voter: userAddress,
      choice,
      timestamp: new Date(),
      blockHash: generateBlockHash(),
      blockHeight: getCurrentBlockHeight(),
      gasUsed: 21000 + Math.floor(Math.random() * 5000)
    };

    setProposals(proposals.map(p => 
      p.id === proposalId
        ? { ...p, votes: [...p.votes, voteRecord] }
        : p
    ));
  };

  const getVoteCount = (proposal: Proposal, choice: 'yes' | 'no') => {
    return proposal.votes.filter(vote => vote.choice === choice).length;
  };

  const getTotalVotes = (proposal: Proposal) => {
    return proposal.votes.length;
  };

  const getVotePercentage = (proposal: Proposal, choice: 'yes' | 'no') => {
    const total = getTotalVotes(proposal);
    if (total === 0) return 0;
    return Math.round((getVoteCount(proposal, choice) / total) * 100);
  };

  const isProposalActive = (proposal: Proposal) => {
    return new Date() < proposal.endTime && proposal.status === 'active';
  };

  const hasUserVoted = (proposal: Proposal) => {
    return proposal.votes.some(vote => vote.voter === userAddress);
  };

  const getTimeRemaining = (endTime: Date) => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  const getQuorumStatus = (proposal: Proposal) => {
    const totalVotes = getTotalVotes(proposal);
    const percentage = Math.round((totalVotes / proposal.requiredQuorum) * 100);
    return { totalVotes, percentage, reached: totalVotes >= proposal.requiredQuorum };
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Treasury': 'bg-green-100 text-green-800',
      'Technical': 'bg-blue-100 text-blue-800',
      'Governance': 'bg-purple-100 text-purple-800',
      'General': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.General;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-2xl shadow-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-xl shadow-lg">
              <Vote className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Decentralized Governance</h1>
              <p className="text-purple-200 text-lg">Transparent • Immutable • Community-Driven</p>
              <div className="flex items-center space-x-4 mt-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>Secured by Blockchain</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>Block #{currentBlockHeight.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-purple-200 text-sm mb-1">Connected Wallet</p>
            <p className="font-mono text-lg text-white">
              {shortenAddress(userAddress)}
            </p>
            <p className="text-purple-200 text-xs mt-1">Voting Power: 1,250 tokens</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Vote className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{proposals.length}</p>
              <p className="text-gray-600 text-sm">Total Proposals</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {proposals.filter(p => isProposalActive(p)).length}
              </p>
              <p className="text-gray-600 text-sm">Active Votes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {proposals.reduce((acc, p) => acc + getTotalVotes(p), 0)}
              </p>
              <p className="text-gray-600 text-sm">Total Votes Cast</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <img src={baseLogo} alt="Base Network" className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">1,100,000</p>
              <p className="text-gray-600 text-sm">Total Supply</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Proposal Button */}
      <button
        onClick={() => setShowCreateForm(true)}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl flex items-center space-x-3 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
      >
        <Plus className="w-6 h-6" />
        <span className="text-lg font-semibold">Create New Proposal</span>
      </button>

      {/* Create Proposal Form */}
      {showCreateForm && (
        <div className="bg-white rounded-2xl shadow-xl border p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Create New Proposal</h2>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Proposal Title
              </label>
              <input
                type="text"
                value={newProposal.title}
                onChange={(e) => setNewProposal({...newProposal, title: e.target.value})}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                placeholder="Enter a clear, descriptive title..."
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Description
              </label>
              <textarea
                value={newProposal.description}
                onChange={(e) => setNewProposal({...newProposal, description: e.target.value})}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-32 resize-none"
                placeholder="Provide detailed information about your proposal..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Category
              </label>
              <select
                value={newProposal.category}
                onChange={(e) => setNewProposal({...newProposal, category: e.target.value})}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="General">General</option>
                <option value="Treasury">Treasury</option>
                <option value="Technical">Technical</option>
                <option value="Governance">Governance</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Voting Duration
              </label>
              <select
                value={newProposal.duration}
                onChange={(e) => setNewProposal({...newProposal, duration: e.target.value})}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="24">24 hours</option>
                <option value="48">48 hours</option>
                <option value="72">3 days</option>
                <option value="168">1 week</option>
                <option value="336">2 weeks</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Required Quorum (minimum votes needed)
              </label>
              <input
                type="number"
                value={newProposal.requiredQuorum}
                onChange={(e) => setNewProposal({...newProposal, requiredQuorum: e.target.value})}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="100"
                min="1"
              />
            </div>
            
            <div className="md:col-span-2 flex space-x-4 pt-4">
              <button
                onClick={createProposal}
                disabled={!newProposal.title.trim() || !newProposal.description.trim()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl transition-all font-semibold"
              >
                Create Proposal
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Proposals List */}
      <div className="space-y-6">
        {proposals.map((proposal) => {
          const quorumStatus = getQuorumStatus(proposal);
          
          return (
            <div key={proposal.id} className="bg-white rounded-2xl shadow-lg border overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-8">
                {/* Proposal Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(proposal.category)}`}>
                        {proposal.category}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isProposalActive(proposal) 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {isProposalActive(proposal) ? 'Active' : 'Ended'}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {proposal.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{proposal.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>By {shortenAddress(proposal.createdBy)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span className={isProposalActive(proposal) ? 'text-green-600 font-medium' : 'text-red-600'}>
                          {getTimeRemaining(proposal.endTime)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{getTotalVotes(proposal)} votes</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quorum Status */}
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Quorum Progress</span>
                    <span className="text-sm text-gray-600">
                      {quorumStatus.totalVotes} / {proposal.requiredQuorum} votes ({quorumStatus.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        quorumStatus.reached ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(quorumStatus.percentage, 100)}%` }}
                    />
                  </div>
                  {quorumStatus.reached && (
                    <p className="text-green-600 text-xs mt-1 font-medium">✓ Quorum reached</p>
                  )}
                </div>

                {/* Voting Results */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-gray-900">Results</span>
                    <span className="text-sm text-gray-500">{getTotalVotes(proposal)} total votes</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <span className="text-sm font-semibold text-gray-700 w-12">Yes</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-green-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${getVotePercentage(proposal, 'yes')}%` }}
                        />
                      </div>
                      <span className="text-lg font-bold text-gray-900 w-20 text-right">
                        {getVoteCount(proposal, 'yes')} ({getVotePercentage(proposal, 'yes')}%)
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <XCircle className="w-6 h-6 text-red-600" />
                      <span className="text-sm font-semibold text-gray-700 w-12">No</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-red-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${getVotePercentage(proposal, 'no')}%` }}
                        />
                      </div>
                      <span className="text-lg font-bold text-gray-900 w-20 text-right">
                        {getVoteCount(proposal, 'no')} ({getVotePercentage(proposal, 'no')}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Voting Buttons */}
                {isProposalActive(proposal) && !hasUserVoted(proposal) && (
                  <div className="flex space-x-4 mb-6">
                    <button
                      onClick={() => castVote(proposal.id, 'yes')}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl flex items-center justify-center space-x-3 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Vote Yes</span>
                    </button>
                    <button
                      onClick={() => castVote(proposal.id, 'no')}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl flex items-center justify-center space-x-3 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                    >
                      <XCircle className="w-5 h-5" />
                      <span className="font-semibold">Vote No</span>
                    </button>
                  </div>
                )}

                {hasUserVoted(proposal) && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-blue-800 font-medium">
                      ✓ You have successfully cast your vote on this proposal
                    </p>
                  </div>
                )}

                {/* Vote History Toggle */}
                <button
                  onClick={() => setSelectedProposal(selectedProposal === proposal.id ? null : proposal.id)}
                  className="text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-2 transition-colors"
                >
                  <Hash className="w-5 h-5" />
                  <span>View Blockchain Records ({proposal.votes.length})</span>
                </button>
              </div>

              {/* Vote History */}
              {selectedProposal === proposal.id && proposal.votes.length > 0 && (
                <div className="border-t bg-gray-50 p-8">
                  <h4 className="font-bold text-gray-900 mb-6 text-lg">Immutable Vote Records</h4>
                  <div className="space-y-4">
                    {proposal.votes.map((vote) => (
                      <div key={vote.id} className="bg-white p-6 rounded-xl border shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-mono text-blue-600 font-semibold">
                            {shortenAddress(vote.voter)}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                            vote.choice === 'yes' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {vote.choice.toUpperCase()}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-semibold">Block Height:</span>
                            <p className="font-mono text-blue-600">#{vote.blockHeight.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="font-semibold">Gas Used:</span>
                            <p className="font-mono">{vote.gasUsed.toLocaleString()}</p>
                          </div>
                          <div className="md:col-span-2">
                            <span className="font-semibold">Transaction Hash:</span>
                            <p className="font-mono text-xs text-gray-500 break-all">{vote.blockHash}</p>
                          </div>
                          <div className="md:col-span-2">
                            <span className="font-semibold">Timestamp:</span>
                            <p>{vote.timestamp.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {proposals.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border">
            <Vote className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Proposals Yet</h3>
            <p className="text-gray-500">Be the first to create a proposal and start the governance process!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockchainVoting;