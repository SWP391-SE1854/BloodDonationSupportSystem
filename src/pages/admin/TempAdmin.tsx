import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TempAdmin = () => {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Temporary Admin Page</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a temporary page for Admin functionalities. The main portal is currently under maintenance.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TempAdmin; 