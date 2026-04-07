import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';

const initialColumns = {
  'primer-contacto': {
    id: 'primer-contacto',
    title: 'Primer Contacto',
    items: [
      { id: 'nc-1', name: 'Luis Paredes', phone: '0414-0001122', date: 'Hace 2 días' },
      { id: 'nc-2', name: 'Marta Diaz', phone: '0412-1112233', date: 'Hace 3 días' }
    ]
  },
  'en-visitas': {
    id: 'en-visitas',
    title: 'En Visitas',
    items: [
      { id: 'nc-3', name: 'Roberto Sanchez', phone: '0424-3334455', date: 'Hace 1 semana' }
    ]
  },
  'discipulado': {
    id: 'discipulado',
    title: 'En Discipulado',
    items: [
      { id: 'nc-4', name: 'Camila Rojas', phone: '0416-5556677', date: 'Hace 2 semanas' }
    ]
  },
  'integrado': {
    id: 'integrado',
    title: 'Integrado',
    items: []
  }
};

export function MembersKanban() {
  const [columns, setColumns] = useState(initialColumns);
  const { isAdmin } = useAuth();
  const { addToast } = useToast();

  const onDragEnd = (result) => {
    if (!isAdmin) {
      addToast('No tienes permisos administrativos para mover las tarjetas de consolidación.', 'error');
      return;
    }

    if (!result.destination) return;
    
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      
      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceColumn, items: sourceItems },
        [destination.droppableId]: { ...destColumn, items: destItems }
      });
      addToast(`Movido a ${destColumn.title}`, 'info');
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      
      setColumns({
        ...columns,
        [source.droppableId]: { ...column, items: copiedItems }
      });
    }
  };

  return (
    <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem', minHeight: '600px' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.entries(columns).map(([columnId, column]) => (
          <div key={columnId} style={{ display: 'flex', flexDirection: 'column', width: '320px', minWidth: '320px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)', padding: '1rem', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {column.title}
              <span style={{ fontSize: '0.75rem', background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: '12px' }}>
                {column.items.length}
              </span>
            </h3>
            
            <Droppable droppableId={columnId} isDropDisabled={!isAdmin}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    flex: 1,
                    minHeight: '100px',
                    transition: 'background-color 0.2s',
                    background: snapshot.isDraggingOver ? 'var(--bg-secondary)' : 'transparent',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  {column.items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={!isAdmin}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            userSelect: 'none',
                            marginBottom: '0.75rem',
                            ...provided.draggableProps.style
                          }}
                        >
                          <Card style={{ 
                            boxShadow: snapshot.isDragging ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
                            border: snapshot.isDragging ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                            cursor: isAdmin ? 'grab' : 'default'
                          }}>
                            <CardContent style={{ padding: '1rem' }}>
                              <h4 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{item.name}</h4>
                              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{item.phone}</p>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Ingreso: {item.date}</p>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
}
