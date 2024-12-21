import { supabase } from '../../../../lib/db';
import { NextResponse } from 'next/server';

const logout = async () => {
    const {error } = await supabase.auth.signOut()

    if (error) {
      console.error( error);
      
    }
    alert('loggedout');

}