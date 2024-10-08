'use client';
import React, { useEffect, useState } from 'react';
import { MyColumnDef } from './InventoryTable';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
  MenuItem,
} from '@mui/material';
import { Vension, Freezer } from '@/general_types';
import { validateVension } from '@/validation';

export const RecordForm = ({
  open,
  columns,
  rowToEdit,
  defaultValues,
  freezers,
  onClose,
  onUpdate,
  onSubmit,
  setColumnsState,
}: {
  open: boolean;
  columns: MyColumnDef[];
  rowToEdit: Vension | null;
  defaultValues: Vension;
  freezers: Freezer[];
  onClose: () => void;
  onUpdate: (values: Vension) => void;
  onSubmit: (values: Vension) => void;
  setColumnsState: (columns: MyColumnDef[]) => void;
}) => {
  const [values, setValues] = useState<Vension>(() => {
    if (rowToEdit) return rowToEdit;
    else return defaultValues;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const theme = useTheme();
  const isFullscreen = useMediaQuery(() => theme.breakpoints.down('sm'));

  useEffect(() => {
    if (open) {
      if (rowToEdit) {
        setValues(rowToEdit);
      } else {
        setValues(defaultValues);
      }
    }
  }, [open]);

  const handleSubmit = () => {
    const errors = validateVension(values);

    const freezer_drawer_numbers = freezers.find(freezer => freezer.id === values.freezer_id)?.drawer_numbers;
    if (freezer_drawer_numbers) {
      if (values.drawer_number !== 'Nicht zugewiesen' && Number(values.drawer_number) > freezer_drawer_numbers!) {
        errors.drawer_number = 'Diese Schublade existiert nicht';
      }
    }

    if (Object.keys(errors).length !== 0) {
      setErrors(errors);
    } else {
      if (rowToEdit) onUpdate(values);
      else onSubmit(values);

      onClose();
      setValues(defaultValues);
      setErrors({});
    }
  };

  const handleKeypress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // update drawer number menu items if freezer_id changes
    if (e.target.name === 'freezer_id') {
      const freezer = freezers.find(freezer => freezer.id === Number(e.target.value));
      const drawer_numbers: Array<string | number> = ['Nicht zugewiesen'];
      for (let i = 1; freezer && i <= freezer.drawer_numbers; i++) {
        drawer_numbers.push(i);
      }
      setColumnsState(
        columns.map(column => {
          if (column.accessorKey === 'drawer_number') {
            return {
              ...column,
              muiTextFieldProps: () => ({
                type: 'number',
                select: true,
                defaultValue: 'Nicht zugewiesen',
                children: drawer_numbers.map(drawer_number => (
                  <MenuItem key={drawer_number} value={drawer_number}>
                    {drawer_number}
                  </MenuItem>
                )),
              }),
            };
          }
          return column;
        })
      );
    }

    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCancle = () => {
    onClose();
    setValues(defaultValues);
    setErrors({});
  };

  return (
    <Dialog open={open} onKeyUp={handleKeypress} fullScreen={isFullscreen}>
      <DialogTitle textAlign="center">{rowToEdit ? 'Eintrag Bearbeiten' : 'Neuen Eintrag erstellen'}</DialogTitle>
      <DialogContent>
        <form onSubmit={e => e.preventDefault()}>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: 3,
              mt: 1,
            }}>
            {columns.map(column => {
              if (column.showInForm === false) return null;

              const textFieldProps = column.muiTextFieldProps ? column.muiTextFieldProps() : {};

              return (
                <TextField
                  {...textFieldProps}
                  key={column.accessorKey}
                  name={column.accessorKey}
                  label={column.header}
                  variant="outlined"
                  onChange={handleChange}
                  error={!!errors[column.accessorKey]}
                  helperText={errors[column.accessorKey]}
                  defaultValue={rowToEdit ? rowToEdit[column.accessorKey] : defaultValues[column.accessorKey]}
                />
              );
            })}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleCancle}>Abbrechen</Button>
        <Button type="submit" color="secondary" onClick={handleSubmit} variant="contained">
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
};
