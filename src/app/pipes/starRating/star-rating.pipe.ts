import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'starRating'
})
export class StarRatingPipe implements PipeTransform {
  transform(rating: number, maxStars: number = 5): string {
    const fullStars = Math.floor(rating);
    const halfStars = Math.round(rating - fullStars);
    const emptyStars = maxStars - fullStars - halfStars;

    return '<i class="bi bi-star-fill"></i>'.repeat(fullStars) +
           '<i class="bi bi-star-half"></i>'.repeat(halfStars) +
           '<i class="bi bi-star"></i>'.repeat(emptyStars);
  }
}
