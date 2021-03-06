import { AppState, RedditSubmission } from '@models';
import { NO_SAVED_POSTS } from '@app/constants';
import { RedditApiService } from '@utils/reddit.service';
import { addUsername } from '@views/login/login.actions';
import { NormalizedRedditSubmissions } from '@utils/normalization';

export const SavedListingActions = {
  SET_SAVED_LISTING_LOADING: 'SAVEDLISTING:SET_SAVED_LISTING_LOADING',
  ADD_SAVED_LISTING_ERROR: 'SAVEDLISTING:ADD_SAVED_LISTING_ERROR',
  ADD_SUBREDDITS_LIST: 'SAVEDLISTING:ADD_SUBREDDITS_LIST',
  ADD_SUBMISSIONS: 'SAVEDLISTING:ADD_SUBMISSIONS',
  CLEAR_SUBMISSIONS: 'SAVEDLISTING:CLEAR_SUBMISSIONS',
  MERGE_IN_SUBMISSIONS: 'SAVEDLISTING:MERGE_IN_SUBMISSIONS',
};

export const setSavedListingLoading = (loading?: boolean) => ({
  type: SavedListingActions.SET_SAVED_LISTING_LOADING,
  loading,
});

export const addSavedListingError = (error: String) => ({
  type: SavedListingActions.ADD_SAVED_LISTING_ERROR,
  error,
});

export const addSubredditsList = (subs: string[]) => ({
  type: SavedListingActions.ADD_SUBREDDITS_LIST,
  subs,
});

export const addSubmissions = (submissions: RedditSubmission[]) => ({
  type: SavedListingActions.ADD_SUBMISSIONS,
  submissions,
});

export const clearSubmissions = () => ({
  type: SavedListingActions.CLEAR_SUBMISSIONS,
});

export const mergeInSubmissions = (
  submissions: NormalizedRedditSubmissions
) => ({
  type: SavedListingActions.MERGE_IN_SUBMISSIONS,
  submissions,
});

type StateGetter = () => AppState;

export const fetchSavedListingAsync = () => async (
  dispatch,
  getState: StateGetter
) => {
  dispatch(setSavedListingLoading(true));

  const { redditToken } = getState().login;

  if (!redditToken) {
    window.location = '/' as any;
    return;
  }

  const api = new RedditApiService(redditToken);

  const { data: profile } = await api.fetchIdentity();

  // add profile data to the login store
  dispatch(addUsername(profile.name));

  let after;
  while (after !== null) {
    const { data: listing } = await api.fetchSaved(profile.name, after);
    dispatch(addSubmissions(listing.data.children));
    after = listing.data.after;

    if (listing.data.dist === 0) {
      dispatch(addSavedListingError(NO_SAVED_POSTS));
      break;
    }
  }

  dispatch(setSavedListingLoading(false));
};
