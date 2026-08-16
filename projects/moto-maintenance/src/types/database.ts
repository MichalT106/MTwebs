export type DbTrackingMethod = 'date' | 'mileage';
export type DbIntervalUnit = 'days' | 'months' | 'years' | 'km';

export interface Database {
  public: {
    Tables: {
      moto_motorcycles: {
        Row: {
          id: string;
          user_id: string;
          manufacturer: string;
          model: string;
          year: number;
          current_mileage: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          manufacturer: string;
          model: string;
          year: number;
          current_mileage?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          manufacturer?: string;
          model?: string;
          year?: number;
          current_mileage?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      moto_custom_maintenance_types: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      moto_maintenance_items: {
        Row: {
          id: string;
          user_id: string;
          motorcycle_id: string;
          custom_type_id: string | null;
          name: string;
          catalog_key: string;
          tracking_method: DbTrackingMethod;
          last_maintenance_date: string | null;
          last_maintenance_mileage: number | null;
          interval_value: number;
          interval_unit: DbIntervalUnit;
          enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          motorcycle_id: string;
          custom_type_id?: string | null;
          name: string;
          catalog_key: string;
          tracking_method: DbTrackingMethod;
          last_maintenance_date?: string | null;
          last_maintenance_mileage?: number | null;
          interval_value: number;
          interval_unit: DbIntervalUnit;
          enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          motorcycle_id?: string;
          custom_type_id?: string | null;
          name?: string;
          catalog_key?: string;
          tracking_method?: DbTrackingMethod;
          last_maintenance_date?: string | null;
          last_maintenance_mileage?: number | null;
          interval_value?: number;
          interval_unit?: DbIntervalUnit;
          enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
