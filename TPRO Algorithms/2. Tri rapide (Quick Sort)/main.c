#include <stdio.h>

void quickSort(int arr[], int low, int high, long *operationCount);
int partition(int arr[], int low, int high, long *operationCount);

void quickSort(int arr[], int low, int high, long *operationCount) {
    if (low < high) {
        int pi = partition(arr, low, high, operationCount);

        // Tri des deux sous-tableaux
        quickSort(arr, low, pi - 1, operationCount);
        quickSort(arr, pi + 1, high, operationCount);
    }
}

int partition(int arr[], int low, int high, long *operationCount) {
    int pivot = arr[high];
    int i = (low - 1);

    for (int j = low; j < high; j++) {
        (*operationCount)++; 
        if (arr[j] < pivot) {
            i++;
            // Échange
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
            (*operationCount) += 3;
        }
    }

    // Placer le pivot
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    (*operationCount) += 3;

    return (i + 1);
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
    int arr[] = {10, 7, 8, 9, 1, 5};
    int n = sizeof(arr) / sizeof(arr[0]);
    long operationCount = 0;

    quickSort(arr, 0, n - 1, &operationCount);

    printf("Sorted array: \n");
    printArray(arr, n);
    printf("Number of operations: %ld\n", operationCount);
    return 0;
}
