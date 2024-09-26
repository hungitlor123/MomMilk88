import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Typography, Box } from '@mui/material';
import Rating from '@mui/material/Rating';
import { useAppSelector, useAppDispatch } from '../../service/store/store';
import { IFeedbackCreate } from '../../models/Feedback';
import { createFeedbackByProductId } from '../../service/features/feedbackSlice';
import { getProductById } from '../../service/features/productSlice';

type FeedbackFormProps = {
  productId: string | undefined;
};

const FeedbackForm: React.FC<FeedbackFormProps> = ({ productId }) => {
  const { account } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      message: '',
      star: 0,
    },
  });

  const onSubmit = (data: { message: string, star: number }) => {
    if (productId && account) {
      const feedbackData: IFeedbackCreate = {
        productId,
        message: data.message,
        star: data.star,
      };
      dispatch(createFeedbackByProductId(feedbackData))
        .unwrap()
        .then(() => {
          dispatch(getProductById({ id: productId }));
          reset();

        }
        );
    }
  };


  return (
    <div className='w-72'>
      <span className='text-2xl font-bold'>
        Feedback Form
      </span>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography component="legend">Rating</Typography>
          <Controller
            name="star"
            control={control}
            render={({ field }) => (
              <Rating
                {...field}
                value={field.value}
                onChange={(newValue) => field.onChange(newValue)}
              />
            )}
          />
        </Box>
        <Controller
          name="message"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Feedback"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              margin="normal"
            />
          )}
        />
        {account ? (
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        ) : (
          <Typography variant="body2" color="error">
            You must login to give feedback
          </Typography>
        )}
      </form>
    </div>
  );
};

export default FeedbackForm;
