import { GET as getOverview } from '../dashboard/overview/route';

export async function GET() {
  return getOverview();
}
