import { supabase } from '../../../../lib/db';

const logout = async () => {
    const {error } = await supabase.auth.signOut()

    if (error) {
      console.error( error);
      
    }
    alert('loggedout');

}