"""
Simulation Rules - Vehicle Physics and Logic

Pure functions that model vehicle behavior and failure progression.
All functions are pure: they take a VehicleState and return a new VehicleState
without mutating the original.
"""

from typing import Tuple
from .models import VehicleState, EngineState


def simulate_driving_with_code_p0171(
    state: VehicleState,
    days: int
) -> Tuple[VehicleState, str]:
    """
    Simulates driving with error code P0171 (System Too Lean - Bank 1).
    
    Physics/Logic:
    - Lean mixture causes increased combustion temperature
    - High temperature accelerates catalyst wear
    - Risk threshold: >120°C for extended periods
    
    Args:
        state: Current vehicle state
        days: Number of days to simulate
    
    Returns:
        Tuple of (new_state, risk_assessment_message)
    """
    # Create a mutable copy of engine state
    engine_data = state.engine.model_dump()
    
    # Add P0171 to error codes if not present
    if "P0171" not in engine_data["error_codes"]:
        engine_data["error_codes"].append("P0171")
        engine_data["check_engine_light"] = True
    
    # Simulate temperature increase (lean mixture runs hotter)
    # Approximate: +5°C per day of driving
    temp_increase = days * 5
    engine_data["temperature_celsius"] += temp_increase
    
    # Cap at maximum reasonable operating temperature
    engine_data["temperature_celsius"] = min(
        engine_data["temperature_celsius"],
        135.0
    )
    
    # Create new immutable engine state
    new_engine = EngineState(**engine_data)
    
    # Create new vehicle state with updated engine
    new_state = state.model_copy_with_updates(engine=new_engine)
    
    # Generate risk assessment
    final_temp = new_engine.temperature_celsius
    
    if final_temp > 120:
        risk_level = "🚨 ALTO RISCO"
        message = (
            f"{risk_level}: Dirigir {days} dias com P0171 elevará a temperatura "
            f"do motor para ~{final_temp:.1f}°C. Isso pode danificar o catalisador, "
            f"resultando em reparos de R$ 2.000-4.000. **Recomendo diagnóstico imediato!**"
        )
    elif final_temp > 105:
        risk_level = "⚠️ RISCO MODERADO"
        message = (
            f"{risk_level}: Após {days} dias, a temperatura subirá para ~{final_temp:.1f}°C. "
            f"O catalisador está em risco. Agende reparo em até 2-3 dias."
        )
    else:
        risk_level = "ℹ️ RISCO BAIXO"
        message = (
            f"{risk_level}: Temperatura prevista: ~{final_temp:.1f}°C após {days} dias. "
            f"Ainda seguro, mas corrija o problema logo para evitar danos futuros."
        )
    
    return new_state, message


def simulate_ignoring_maintenance(
    state: VehicleState,
    service_type: str,
    months_overdue: int
) -> Tuple[VehicleState, str]:
    """
    Simulates the effects of ignoring scheduled maintenance.
    
    Args:
        state: Current vehicle state
        service_type: Type of maintenance (e.g., "oil_change", "timing_belt")
        months_overdue: How many months past due
    
    Returns:
        Tuple of (new_state, risk_assessment_message)
    """
    engine_data = state.engine.model_dump()
    
    if service_type.lower() == "oil_change":
        # Simulate oil degradation
        # Every month overdue reduces oil effectiveness by ~15%
        oil_degradation = min(months_overdue * 15, 80)
        engine_data["oil_level_percent"] = max(
            100 - oil_degradation,
            20  # Minimum before catastrophic failure
        )
        
        # Increased friction -> higher temperature
        temp_increase = months_overdue * 3
        engine_data["temperature_celsius"] += temp_increase
        
        new_engine = EngineState(**engine_data)
        new_state = state.model_copy_with_updates(engine=new_engine)
        
        oil_level = new_engine.oil_level_percent
        
        if oil_level < 40:
            message = (
                f"🚨 CRÍTICO: {months_overdue} meses sem troca de óleo! "
                f"Nível de proteção do óleo: apenas {oil_level:.0f}%. "
                f"**Alto risco de dano ao motor** (pistões, bronzinas). "
                f"Reparo pode custar R$ 5.000-15.000. **Troque URGENTE!**"
            )
        elif oil_level < 70:
            message = (
                f"⚠️ ATENÇÃO: Óleo degradado após {months_overdue} meses. "
                f"Proteção reduzida para {oil_level:.0f}%. "
                f"Agende troca em até 1 semana para evitar danos."
            )
        else:
            message = (
                f"ℹ️ ALERTA: {months_overdue} meses desde a troca. "
                f"Óleo ainda funcional ({oil_level:.0f}%), mas programe a troca."
            )
        
        return new_state, message
    
    # Extensible for other service types
    return state, f"Simulação para '{service_type}' não implementada ainda."


def simulate_cold_start_in_winter(
    state: VehicleState,
    ambient_temp_celsius: float
) -> Tuple[VehicleState, str]:
    """
    Simulates starting the engine in cold weather.
    
    Args:
        state: Current vehicle state
        ambient_temp_celsius: Ambient temperature
    
    Returns:
        Tuple of (new_state, startup_advice)
    """
    engine_data = state.engine.model_dump()
    
    # Engine starts at ambient temperature
    engine_data["temperature_celsius"] = ambient_temp_celsius
    engine_data["is_running"] = True
    
    # Cold starts are harder on the engine
    if ambient_temp_celsius < 0:
        # Very cold - show error P0300 (random misfire)
        if "P0300" not in engine_data["error_codes"]:
            engine_data["error_codes"].append("P0300")
        
        advice = (
            f"🥶 PARTIDA FRIA ({ambient_temp_celsius}°C): "
            f"Deixe o motor aquecer por 3-5 minutos antes de dirigir. "
            f"Evite alta rotação até atingir 60°C. Misfires temporários são normais."
        )
    elif ambient_temp_celsius < 10:
        advice = (
            f"🌡️ CLIMA FRIO ({ambient_temp_celsius}°C): "
            f"Aguarde 1-2 minutos antes de dirigir. "
            f"Dirija suavemente até o motor aquecer (>70°C)."
        )
    else:
        advice = (
            f"✅ TEMPERATURA NORMAL ({ambient_temp_celsius}°C): "
            f"Pode dirigir após 30 segundos. Motor aquecerá rapidamente."
        )
    
    new_engine = EngineState(**engine_data)
    new_state = state.model_copy_with_updates(engine=new_engine)
    
    return new_state, advice
