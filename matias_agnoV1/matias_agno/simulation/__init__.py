"""
Vehicle State Simulation Engine (VSE)

Provides predictive simulation capabilities for vehicle diagnostics.
"""

from .models import VehicleState, EngineState
from .rules import (
    simulate_driving_with_code_p0171,
    simulate_ignoring_maintenance,
    simulate_cold_start_in_winter,
)

__all__ = [
    "VehicleState",
    "EngineState",
    "simulate_driving_with_code_p0171",
    "simulate_ignoring_maintenance",
    "simulate_cold_start_in_winter",
]
