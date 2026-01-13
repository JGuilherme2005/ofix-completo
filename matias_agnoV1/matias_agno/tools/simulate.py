"""
Vehicle Simulation Tool

Enables the agent to perform predictive simulation of vehicle scenarios.
"""

from agno.tools import tool
from typing import Optional
from ..simulation import (
    VehicleState,
    EngineState,
    simulate_driving_with_code_p0171,
    simulate_ignoring_maintenance,
    simulate_cold_start_in_winter,
)


@tool
def simulate_vehicle_scenario(
    scenario_type: str,
    days: Optional[int] = None,
    months_overdue: Optional[int] = None,
    service_type: Optional[str] = None,
    ambient_temperature: Optional[float] = None,
) -> str:
    """
    Simula cenários de veículo para prever consequências de ações ou falhas.
    
    Use esta ferramenta quando o usuário perguntar "e se?" sobre:
    - Dirigir com um código de erro ativo
    - Ignorar manutenção programada
    - Partir o motor em condições específicas
    
    Args:
        scenario_type: Tipo de cenário. Valores:
            - "driving_with_error_p0171": Dirigir com erro P0171
            - "ignore_oil_change": Ignorar troca de óleo
            - "cold_start": Partida em clima frio
        days: Número de dias (para scenarios de direção)
        months_overdue: Meses atrasado na manutenção
        service_type: Tipo de serviço (ex: "oil_change")
        ambient_temperature: Temperatura ambiente em Celsius
    
    Returns:
        Avaliação de risco e recomendações
    
    Examples:
        >>> simulate_vehicle_scenario("driving_with_error_p0171", days=3)
        >>> simulate_vehicle_scenario("ignore_oil_change", months_overdue=6, service_type="oil_change")
        >>> simulate_vehicle_scenario("cold_start", ambient_temperature=-5)
    """
    # Create a default vehicle state for simulation
    # In a production system, this would come from actual vehicle data
    default_state = VehicleState(
        engine=EngineState(
            temperature_celsius=90.0,
            rpm=0,
            is_running=False,
            air_fuel_ratio=14.7,
            check_engine_light=False,
            error_codes=[],
            oil_level_percent=100.0,
        ),
        mileage_km=50000,
        last_oil_change_km=45000,
    )
    
    try:
        if scenario_type == "driving_with_error_p0171":
            if days is None:
                return "❌ Por favor, especifique quantos dias: use o parâmetro 'days'"
            
            new_state, assessment = simulate_driving_with_code_p0171(
                default_state,
                days
            )
            
            return f"""
🔮 **Simulação: Dirigir {days} dias com erro P0171**

{assessment}

**Estado Final do Motor:**
- Temperatura: {new_state.engine.temperature_celsius:.1f}°C
- Códigos de Erro: {', '.join(new_state.engine.error_codes)}
- Check Engine: {'Ligado' if new_state.engine.check_engine_light else 'Desligado'}
"""
        
        elif scenario_type == "ignore_oil_change":
            if months_overdue is None or service_type is None:
                return "❌ Por favor, especifique 'months_overdue' e 'service_type'"
            
            new_state, assessment = simulate_ignoring_maintenance(
                default_state,
                service_type,
                months_overdue
            )
            
            return f"""
🔮 **Simulação: {months_overdue} meses sem {service_type}**

{assessment}

**Estado Final do Motor:**
- Nível de Óleo: {new_state.engine.oil_level_percent:.0f}%
- Temperatura: {new_state.engine.temperature_celsius:.1f}°C
"""
        
        elif scenario_type == "cold_start":
            if ambient_temperature is None:
                return "❌ Por favor, especifique 'ambient_temperature'"
            
            new_state, advice = simulate_cold_start_in_winter(
                default_state,
                ambient_temperature
            )
            
            return f"""
🔮 **Simulação: Partida a {ambient_temperature}°C**

{advice}

**Estado do Motor Após Partida:**
- Temperatura Inicial: {new_state.engine.temperature_celsius:.1f}°C
- Motor: {'Ligado' if new_state.engine.is_running else 'Desligado'}
- Códigos de Erro: {', '.join(new_state.engine.error_codes) if new_state.engine.error_codes else 'Nenhum'}
"""
        
        else:
            available_scenarios = [
                "driving_with_error_p0171",
                "ignore_oil_change",
                "cold_start"
            ]
            return f"❌ Cenário '{scenario_type}' não reconhecido. Disponíveis: {', '.join(available_scenarios)}"
    
    except Exception as e:
        return f"❌ Erro na simulação: {str(e)}"
