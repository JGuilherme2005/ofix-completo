// @ts-nocheck
import React from 'react';

export default function QuickActions({ userType = 'cliente', onActionClick, className = '' }) {
	const commonActions = [
		{ type: 'status_os', label: 'Ver status da OS' },
		{ type: 'agendar', label: 'Agendar serviço' },
		{ type: 'diagnostico', label: 'Iniciar diagnóstico' }
	];

	const mechanicActions = [
		{ type: 'procedimentos', label: 'Procedimentos técnicos' },
		{ type: 'historico_solucoes', label: 'Histórico de soluções' }
	];

	const actions = userType === 'mecanico' ? [...commonActions, ...mechanicActions] : commonActions;

	return (
		<div className={`flex flex-wrap gap-2 ${className}`}>
			{actions.map((a) => (
				<button
					key={a.type}
					onClick={() => onActionClick?.(a)}
					className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-full border border-slate-200 dark:border-slate-700 transition-colors"
				>
					{a.label}
				</button>
			))}
		</div>
	);
}
