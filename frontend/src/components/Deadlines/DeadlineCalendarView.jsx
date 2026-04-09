import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import 'bootstrap-icons/font/bootstrap-icons.css'; // needed for bootstrap5 theme
import { useNavigate } from 'react-router-dom';

const DeadlineCalendarView = ({ deadlines, groups = [], viewType = 'dayGridMonth' }) => {
    const navigate = useNavigate();

    const getGroupNameById = (groupId) => {
        const group = groups.find(g => g.id === groupId);
        return group ? group.name : null;
    };

    const getResourceId = (group) => {
        if (!group) return 'personal';
        return typeof group === 'object' ? `group_${group.id}` : `group_${group}`;
    };

    // Transform API deadlines to FullCalendar events format
    const events = deadlines.map(deadline => {
        // Optional prefix for group deadlines
        const actualGroupId = typeof deadline.group === 'object' ? deadline.group?.id : deadline.group;
        const resolvedGroupName = getGroupNameById(actualGroupId);
        const prefix = resolvedGroupName ? `[${resolvedGroupName}] ` : '';

        return {
            id: deadline.id,
            title: `${prefix}${deadline.name}`, // The backend field uses 'name', not 'title'
            start: deadline.start_date || deadline.due_date, // Use start_date if available
            end: deadline.due_date, // FullCalendar uses start/end for ranges
            date: !deadline.start_date ? deadline.due_date : undefined, // fallback for single-day if no start
            allDay: true, // Make them span across days cleanly
            resourceId: getResourceId(deadline.group),
            backgroundColor: deadline.group ? '#0d6efd' : '#198754', // Blue for group, green for personal
            borderColor: deadline.group ? '#0a58ca' : '#146c43',
            extendedProps: {
                description: deadline.description,
                isGroup: !!deadline.group,
                groupName: resolvedGroupName
            }
        };
    });

    // Build timeline resources dynamically
    const resourcesMap = new Map();
    resourcesMap.set('personal', { id: 'personal', title: 'Personnel', order: 1 });
    deadlines.forEach(deadline => {
        if (deadline.group) {
            const isObj = typeof deadline.group === 'object';
            const groupId = isObj ? deadline.group.id : deadline.group;
            const resId = `group_${groupId}`;

            // Prefer the resolved group name
            const groupName = getGroupNameById(groupId) || (isObj && deadline.group.name ? deadline.group.name : `Groupe ${groupId}`);

            if (!resourcesMap.has(resId)) {
                resourcesMap.set(resId, { id: resId, title: groupName, order: 2 });
            }
        }
    });
    const resources = Array.from(resourcesMap.values()).sort((a, b) => a.order - b.order);

    const handleEventClick = (clickInfo) => {
        // Navigate to the detail page of the deadline when clicked
        navigate(`/deadlines/${clickInfo.event.id}`);
    };

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <FullCalendar
                    key={viewType} // Force re-render if viewType changes to avoid layout bugs
                    schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives" // Silence premium warning for dev
                    plugins={[dayGridPlugin, timeGridPlugin, resourceTimelinePlugin, bootstrap5Plugin]}
                    initialView={viewType}
                    themeSystem="bootstrap5"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: viewType.includes('Timeline')
                            ? 'resourceTimelineMonth,resourceTimelineWeek'
                            : 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    events={events}
                    resources={resources}
                    eventClick={handleEventClick}
                    height="auto"
                    locale="fr"
                    buttonText={{
                        today: "Aujourd'hui",
                        month: 'Mois',
                        week: 'Semaine',
                        day: 'Jour',
                        resourceTimelineMonth: 'Timeline Mois',
                        resourceTimelineWeek: 'Timeline Semaine'
                    }}
                    resourceAreaWidth="25%"
                    resourceAreaHeaderContent="Projets / Groupes"
                />
            </div>
        </div>
    );
};

export default DeadlineCalendarView;
