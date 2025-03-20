from rest_framework import generics
from .models import Review
from .serializers import ReviewSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly,IsAuthenticated
from django.db.models import Avg
from rest_framework.response import Response
from rest_framework.decorators import action,api_view
from rest_framework import status
from rest_framework.generics import RetrieveAPIView
from user.models import MyUser


class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """Filter reviews by product_id from URL path"""
        product_id = self.kwargs.get('product_id')
        if product_id:
            return Review.objects.filter(product_id=product_id)
        return Review.objects.all()

    def perform_create(self, serializer):
        """Ensure user is assigned to review"""
        user = self.request.user
        product_id = self.kwargs.get('product_id')

       
        # Proceed to create the review
        serializer.save(user=self.request.user)

   
prod_reviews = ReviewListCreateView.as_view()

@api_view(['GET'])
def review_summary(request, product_id):
    """Get the average review rating for a specific product"""
    reviews = Review.objects.filter(product_id=product_id)
    avg_rating = round(reviews.aggregate(Avg('rating'))['rating__avg'],1)
    
    # If there are no reviews, set avg_rating to 0
    if avg_rating is None:
        avg_rating = 0  # Or any default value you want
    
    return Response({"avg_rating": avg_rating})



class ReviewCheckView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        product_id = self.kwargs.get('product_id')
        # Check if the logged-in user has already reviewed this product
        review = Review.objects.filter(product_id=product_id, user=request.user).first()
        if review:
            return Response({"review_exists": True, "review_id": review.id,"comment":review.comment,"rating":review.rating})
        return Response({"review_exists": False})

check_review=ReviewCheckView.as_view()


@api_view(['PATCH'])
def update_review(request, review_id):
    try:
        # Check if review exists
        review = Review.objects.get(id=review_id)

        # Ensure that the logged-in user is the owner of the review
        if review.user != request.user:
            return Response({"detail": "You cannot edit someone else's review."}, status=status.HTTP_403_FORBIDDEN)

        # Only allow updating the review text and rating
        serializer = ReviewSerializer(review, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Review.DoesNotExist:
        return Response({"detail": "Review not found."}, status=status.HTTP_404_NOT_FOUND)
    
    
    
class DeleteReview(generics.DestroyAPIView):
    serializer_class=ReviewSerializer
    queryset=Review.objects.all()
    permission_classes=[IsAuthenticated]
    
delete_review=DeleteReview.as_view()

