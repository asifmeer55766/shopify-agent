/**
 * Declarations of tools callable by the Gemini AI Agent
 */

export interface AgentToolDeclaration {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, { type: string; description: string; enum?: string[] }>;
    required: string[];
  };
}

export const STORE_PILOT_TOOLS: AgentToolDeclaration[] = [
  {
    name: 'get_revenue_and_margins',
    description: 'Fetch net sales, gross profit, margin %, discounts, and refunds for a specified date range.',
    parameters: {
      type: 'object',
      properties: {
        timeframe: {
          type: 'string',
          description: 'The period to analyze',
          enum: ['today', '7d', '30d', '90d'],
        },
      },
      required: ['timeframe'],
    },
  },
  {
    name: 'get_product_profitability',
    description: 'Retrieve top and bottom performing products by profit margin and refund volume.',
    parameters: {
      type: 'object',
      properties: {
        sortBy: {
          type: 'string',
          description: 'Sort metric',
          enum: ['lowest_margin', 'highest_margin', 'highest_refunds', 'highest_revenue'],
        },
        limit: {
          type: 'string',
          description: 'Number of items to return',
        },
      },
      required: ['sortBy'],
    },
  },
  {
    name: 'get_stockout_risks',
    description: 'Identify products projected to run out of stock within the specified number of days based on sales velocity.',
    parameters: {
      type: 'object',
      properties: {
        daysHorizon: {
          type: 'string',
          description: 'Lookahead horizon in days',
          enum: ['7', '14', '30'],
        },
      },
      required: ['daysHorizon'],
    },
  },
];
