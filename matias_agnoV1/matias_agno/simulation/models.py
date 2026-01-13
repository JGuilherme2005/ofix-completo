"""
Vehicle State Models

Immutable Pydantic models representing vehicle digital twin state.
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class EngineState(BaseModel):
    """Represents the current state of a vehicle engine."""
    
    temperature_celsius: float = Field(
        default=90.0,
        ge=-20,
        le=150,
        description="Engine coolant temperature in Celsius"
    )
    
    rpm: int = Field(
        default=0,
        ge=0,
        le=8000,
        description="Engine revolutions per minute"
    )
    
    is_running: bool = Field(
        default=False,
        description="Whether the engine is currently running"
    )
    
    air_fuel_ratio: float = Field(
        default=14.7,
        ge=10.0,
        le=20.0,
        description="Air-fuel mixture ratio (stoichiometric = 14.7)"
    )
    
    check_engine_light: bool = Field(
        default=False,
        description="Check engine light status"
    )
    
    error_codes: List[str] = Field(
        default_factory=list,
        description="Active OBD-II diagnostic trouble codes"
    )
    
    oil_level_percent: float = Field(
        default=100.0,
        ge=0,
        le=100,
        description="Engine oil level as percentage of full"
    )
    
    class Config:
        frozen = True  # Immutable


class MaintenanceRecord(BaseModel):
    """Record of a maintenance event."""
    
    service_type: str = Field(description="Type of service performed")
    date: datetime = Field(description="Date of service")
    mileage_km: int = Field(description="Vehicle mileage at time of service")
    
    class Config:
        frozen = True


class VehicleState(BaseModel):
    """Represents the complete state of a vehicle."""
    
    engine: EngineState = Field(
        default_factory=EngineState,
        description="Current engine state"
    )
    
    mileage_km: int = Field(
        default=50000,
        ge=0,
        description="Total vehicle mileage in kilometers"
    )
    
    last_oil_change_km: Optional[int] = Field(
        default=None,
        description="Mileage at last oil change"
    )
    
    maintenance_history: List[MaintenanceRecord] = Field(
        default_factory=list,
        description="Complete maintenance history"
    )
    
    class Config:
        frozen = True  # Immutable
    
    def model_copy_with_updates(self, **updates):
        """
        Create a new immutable copy with specified updates.
        
        Example:
            new_state = state.model_copy_with_updates(
                engine=state.engine.model_copy(update={'temperature_celsius': 95})
            )
        """
        return self.model_copy(update=updates, deep=True)
