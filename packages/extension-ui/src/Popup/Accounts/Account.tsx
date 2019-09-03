// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useContext, useState } from 'react';
import { routes } from '@polkadot/extension-ui/routes';
import { makeStyles } from '@material-ui/styles';

import { Address, ActionContext, Button, LinkButton, Grid } from '../../components';
import { editAccount } from '../../messaging';
import { Name } from '../../partials';

const useStyles = makeStyles({
  nameInputMarginDense: {
    paddingTop: 6.5,
    paddingBottom: 6.5,
  },
  inputRoot: {
    margin: 0,
  },
});

interface Props {
  address: string;
  className?: string;
  onClick(address: string): void;
}

export default function Account({ address, className, onClick }: Props): React.ReactElement<Props> {
  const onAction = useContext(ActionContext);
  const [isEditing, setEditing] = useState(false);
  const [editedName, setName] = useState<string | null>(null);
  const classes = useStyles();

  const toggleEdit = (): void =>
    setEditing(!isEditing);
  const saveChanges = (): void => {
    if (editedName && editedName !== name) {
      editAccount(address, editedName)
        .then((): void => onAction())
        .catch((error: Error) => console.error(error));
    }

    toggleEdit();
  };

  return (
    <Address
      withBalance
      address={address}
      className={className}
      onClick={onClick.bind(null, address)}
    >

      <Grid container spacing={1} wrap="nowrap" justify="flex-end">
        {isEditing && (<>
          <Grid item xs>
            <Name
              address={address}
              autoFocus
              label={null}
              onBlur={saveChanges}
              onChange={setName}
              margin="dense"
              classes={{
                root: classes.inputRoot,
              }}
              InputProps={{
                classes: { inputMarginDense: classes.nameInputMarginDense },
              }}
            />
          </Grid>
          <Grid item>
            <Button variant="outlined" size="small" onClick={toggleEdit}>Save</Button>
          </Grid>
        </>)}
        {!isEditing && (<>
          <Grid item>
            <Button variant="outlined" size="small" onClick={toggleEdit}>Edit</Button>
          </Grid>
          <Grid item>
            <LinkButton variant="outlined" size="small" to={routes.account.forget.address.getRedirectPath({ address })}>
              Forget
            </LinkButton>
          </Grid>
        </>)}
      </Grid>
    </Address>
  );
}
