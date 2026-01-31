import { config } from '@/config/config';
import { Resend } from 'resend';

export const resend = new Resend(config.RESEND_APIKEY);