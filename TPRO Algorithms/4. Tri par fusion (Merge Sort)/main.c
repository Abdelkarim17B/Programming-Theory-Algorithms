#include <stdio.h>
#include <stdlib.h>

void merge(int arr[], int left, int mid, int right, long *operationCount) {
    int n1 = mid - left + 1;
    int n2 = right - mid;

    // Création des tableaux temporaires
    int L[n1], R[n2];

    for (int i = 0; i < n1; i++) {
        L[i] = arr[left + i];
        (*operationCount)++;
    }
    for (int j = 0; j < n2; j++) {
        R[j] = arr[mid + 1 + j];
        (*operationCount)++; 
    }

    int i = 0, j = 0, k = left;

    while (i < n1 && j < n2) {
        (*operationCount)++; 
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
        (*operationCount)++; 
    }

    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
        (*operationCount)++; 
    }

    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
        (*operationCount)++;
    }
}

void mergeSort(int arr[], int left, int right, long *operationCount) {
    if (left < right) {
        int mid = left + (right - left) / 2;

        mergeSort(arr, left, mid, operationCount);
        mergeSort(arr, mid + 1, right, operationCount);

        merge(arr, left, mid, right, operationCount);
    }
}

void printArray(int arr[], int size) {
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

void printONotation(const char* algorithm, const char* notation) {
    printf("%s: O-Notation = %s\n", algorithm, notation);
}

int main() {
    int arr[] = {12, 11, 13, 5, 6, 7};
    int n = sizeof(arr) / sizeof(arr[0]);
    long operationCount = 0;

    printf("Given array: \n");
    printArray(arr, n);

    mergeSort(arr, 0, n - 1, &operationCount);

    printf("Sorted array: \n");
    printArray(arr, n);

    printf("Number of operations: %ld\n", operationCount); 

    return 0;
}
