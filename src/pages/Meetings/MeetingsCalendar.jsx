import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Card } from '../../components/ui/Card';

const mockEvents = [
  { 
    id: '1', 
    title: 'Servicio Dominical', 
    start: '2026-10-25T09:00:00',
    end: '2026-10-25T11:30:00',
    backgroundColor: 'var(--danger)', // Rojo para generales
    borderColor: 'var(--danger)'
  },
  { 
    id: '2', 
    title: 'Reunión de Líderes', 
    start: '2026-10-27T19:30:00',
    end: '2026-10-27T21:00:00',
    backgroundColor: 'var(--accent-primary)', // Azul para líderes
    borderColor: 'var(--accent-primary)'
  },
  { 
    id: '3', 
    title: 'Ayuno Ministerial', 
    start: '2026-10-31T08:00:00',
    end: '2026-10-31T12:00:00',
    backgroundColor: 'var(--warning)', // Naranja para especiales
    borderColor: 'var(--warning)'
  }
];

export function MeetingsCalendar() {
  return (
    <Card className="glass-panel" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
      <style>
        {`
          .fc-theme-standard td, .fc-theme-standard th { border-color: var(--border-color); }
          .fc-col-header-cell { background-color: var(--bg-tertiary); color: var(--text-primary); padding: 0.5rem 0 !important; }
          .fc-daygrid-day-number { color: var(--text-primary); }
          .fc .fc-button-primary { background-color: var(--bg-secondary); border-color: var(--border-color); color: var(--text-primary); }
          .fc .fc-button-primary:hover { background-color: var(--accent-glow); color: var(--accent-primary); }
          .fc .fc-button-primary:not(:disabled).fc-button-active, .fc .fc-button-primary:not(:disabled):active { background-color: var(--accent-primary); color: white; border-color: var(--accent-primary); }
          .fc-event { border-radius: 4px; padding: 2px 4px; font-size: 0.8rem; border: none; }
          .fc-toolbar-title { color: var(--text-primary); font-size: 1.25rem !important; }
          .fc-daygrid-day-frame { min-height: 100px; }
          .fc-day-today { background-color: var(--accent-glow) !important; }
        `}
      </style>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={mockEvents}
        height="700px"
        buttonText={{
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          day: 'Día'
        }}
        locale="es"
      />
    </Card>
  );
}
