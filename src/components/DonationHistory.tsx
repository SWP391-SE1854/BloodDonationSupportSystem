
import React, { useState } from 'react';
import { Heart, Calendar, MapPin, Filter, Download, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DonationHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600';
      case 'pending': return 'bg-yellow-600';
      case 'cancelled': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getComponentColor = (component: string) => {
    switch (component) {
      case 'Whole Blood': return 'text-red-600 bg-red-100';
      case 'Platelets': return 'text-blue-600 bg-blue-100';
      case 'Plasma': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.component.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.donationId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || donation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalDonations = donations.length;
  const totalQuantity = donations.reduce((sum, d) => sum + d.quantity, 0);
  const lastDonation = donations[0]?.date;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Donation History</h1>
          <p className="text-gray-600 mt-2">Track your contribution to saving lives</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Download className="h-4 w-4 mr-2" />
          Export History
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-red-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Donations</p>
                <p className="text-3xl font-bold text-red-600">{totalDonations}</p>
              </div>
              <Heart className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Volume</p>
                <p className="text-3xl font-bold text-blue-600">{totalQuantity}ml</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <div className="h-4 w-4 bg-blue-600 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last Donation</p>
                <p className="text-lg font-bold text-green-600">{lastDonation}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-red-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-red-600" />
            <span>Filter & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by location, component, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-red-200 focus:border-red-500"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 border-red-200 focus:border-red-500">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Donation History List */}
      <Card className="border-red-100">
        <CardHeader>
          <CardTitle>Donation Records</CardTitle>
          <CardDescription>Your complete donation history ({filteredDonations.length} records)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDonations.map((donation) => (
              <div key={donation.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Heart className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                        <h3 className="font-semibold text-gray-900">{donation.donationId}</h3>
                        <Badge className={getStatusColor(donation.status)}>
                          {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {donation.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {donation.location}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:items-end space-y-2">
                    <Badge className={getComponentColor(donation.component)}>
                      {donation.component}
                    </Badge>
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold">{donation.quantity}ml</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredDonations.length === 0 && (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No donations found</h3>
                <p className="text-gray-600">No donations match your current filters.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationHistory;
