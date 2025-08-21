import Grid from '@mui/material/Grid';
import ActivityList from './ActivityList';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';

type Props = {
    activities: Activity[]
    selectActivity: (id: string) => void
    cancelSelectActivity: () => void
    selectedActivity?: Activity
    editMode: boolean
    openForm: (id?: string) => void
    closeForm: () => void
}

export default function  ActivityDashboard({
    activities, cancelSelectActivity, selectActivity, selectedActivity,
    openForm, closeForm, editMode }: Props) {
    return (
        <Grid container spacing={3}>
            <Grid size={7}>
                <ActivityList
                    activities={activities}
                    selectActivity={selectActivity}
                />
            </Grid>
            <Grid size={5}>
                {selectedActivity && !editMode &&
                    <ActivityDetails
                        selectedActivity={selectedActivity}
                        cancelSelectActivity={cancelSelectActivity}
                        openForm={openForm}
                    />
                }
                {editMode &&
                    <ActivityForm
                        closeForm={closeForm} 
                        activity={selectedActivity}
                    />}
            </Grid>
        </Grid>
    )
}