export interface EndpointStatistic {
  endpoint: string;
  visits: number;
  percentage: number;
}

export interface EndpointStatisticsResponse {
  endpoints: EndpointStatistic[];
  totalEndpoints: number;
  totalVisits: number;
}

export interface UsageChartData {
  labels: string[];
  values: number[];
}

const usageAnalyticsService = {
  /**
   * Get endpoint statistics
   */
  async getEndpointStatistics(
    limit?: number,
    dataType: 'all' | 'api' | 'ui' = 'all'
  ): Promise<EndpointStatisticsResponse> {
    return {
      endpoints: [],
      totalEndpoints: 0,
      totalVisits: 0,
    };
  },

  /**
   * Get chart data for endpoint usage
   */
  async getChartData(
    limit?: number,
    dataType: 'all' | 'api' | 'ui' = 'all'
  ): Promise<UsageChartData> {
    const stats = await this.getEndpointStatistics(limit, dataType);

    return {
      labels: stats.endpoints.map((e) => e.endpoint),
      values: stats.endpoints.map((e) => e.visits),
    };
  },
};

export default usageAnalyticsService;
