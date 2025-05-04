import React from 'react';
import TrafficOverview from './TrafficOverview';
import TrafficSources from './TrafficSources';
import TopDevices from './TopDevices';
import VisitorDemographics from './VisitorDemographics';

function AnalyticsContent() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrafficOverview />
        </div>
        <div>
          <TrafficSources />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TopDevices />
        <VisitorDemographics />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4">Advanced Analytics</h3>
        <p className="text-gray-500">More detailed analytics information will appear here.</p>
      </div>
    </div>
  );
}

export default AnalyticsContent;