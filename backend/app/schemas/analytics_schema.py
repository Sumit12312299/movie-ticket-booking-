from pydantic import BaseModel, Field
from typing import List, Optional

class DashboardSummaryResponse(BaseModel):
    total_revenue: float = Field(..., description="Total aggregate revenue")
    total_tickets_sold: int = Field(..., description="Count of confirmed tickets sold")
    active_movies_count: int = Field(..., description="Number of currently running movies")
    occupancy_rate_percentage: float = Field(..., description="Average seat occupancy rate")

class TopGrossingMovie(BaseModel):
    movie_id: str
    title: str
    gross_revenue: float
    total_bookings: int

class AnalyticsReportResponse(BaseModel):
    summary: DashboardSummaryResponse
    top_movies: List[TopGrossingMovie]
    period: str = "all_time"
