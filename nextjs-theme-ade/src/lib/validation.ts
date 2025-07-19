import { z } from 'zod';
import { PostFrontmatterSchema, PageFrontmatterSchema } from '@/types/content';
import { ValidationResult, ValidationError } from '@/types';

export class ContentValidator {
  static validatePostFrontmatter(data: unknown): ValidationResult {
    try {
      PostFrontmatterSchema.parse(data);
      return { isValid: true, errors: [] };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: ValidationError[] = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));
        return { isValid: false, errors };
      }
      return {
        isValid: false,
        errors: [{ field: 'unknown', message: 'Unknown validation error', code: 'unknown' }],
      };
    }
  }

  static validatePageFrontmatter(data: unknown): ValidationResult {
    try {
      PageFrontmatterSchema.parse(data);
      return { isValid: true, errors: [] };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: ValidationError[] = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));
        return { isValid: false, errors };
      }
      return {
        isValid: false,
        errors: [{ field: 'unknown', message: 'Unknown validation error', code: 'unknown' }],
      };
    }
  }

  static validateContent(content: string): ValidationResult {
    const errors: ValidationError[] = [];

    if (!content || content.trim().length === 0) {
      errors.push({
        field: 'content',
        message: 'Content cannot be empty',
        code: 'required',
      });
    }

    if (content.length < 10) {
      errors.push({
        field: 'content',
        message: 'Content is too short (minimum 10 characters)',
        code: 'min_length',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateImages(content: string): ValidationResult {
    const errors: ValidationError[] = [];
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let match;

    while ((match = imageRegex.exec(content)) !== null) {
      const altText = match[1];
      const imagePath = match[2];

      if (!altText || altText.trim().length === 0) {
        errors.push({
          field: 'image_alt',
          message: `Image at ${imagePath} is missing alt text`,
          code: 'missing_alt_text',
        });
      }

      // Check for relative paths that might be broken
      if (imagePath.startsWith('./') || imagePath.startsWith('../')) {
        // This is a basic check - in a real implementation, you'd verify the file exists
        if (!imagePath.includes('/assets/') && !imagePath.includes('/images/')) {
          errors.push({
            field: 'image_path',
            message: `Image path ${imagePath} might be invalid`,
            code: 'invalid_path',
          });
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateSlug(slug: string): ValidationResult {
    const errors: ValidationError[] = [];

    if (!slug || slug.trim().length === 0) {
      errors.push({
        field: 'slug',
        message: 'Slug cannot be empty',
        code: 'required',
      });
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      errors.push({
        field: 'slug',
        message: 'Slug can only contain lowercase letters, numbers, and hyphens',
        code: 'invalid_format',
      });
    }

    if (slug.startsWith('-') || slug.endsWith('-')) {
      errors.push({
        field: 'slug',
        message: 'Slug cannot start or end with a hyphen',
        code: 'invalid_format',
      });
    }

    if (slug.includes('--')) {
      errors.push({
        field: 'slug',
        message: 'Slug cannot contain consecutive hyphens',
        code: 'invalid_format',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateDate(dateString: string): ValidationResult {
    const errors: ValidationError[] = [];

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        errors.push({
          field: 'date',
          message: 'Invalid date format',
          code: 'invalid_date',
        });
      }
    } catch {
      errors.push({
        field: 'date',
        message: 'Invalid date format',
        code: 'invalid_date',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}