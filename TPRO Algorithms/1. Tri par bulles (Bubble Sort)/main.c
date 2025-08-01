#include <stdio.h>

void bubbleSort(int arr[], int n, long *operationCount) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            (*operationCount)++;
            if (arr[j] > arr[j + 1]) {
                // Échange
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                (*operationCount) += 3;
            }
        }
    }
}

void printArray(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

void printONotation(const char* algorithm, const char* notation) {
    printf("%s: O-Notation = %s\n", algorithm, notation);
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr) / sizeof(arr[0]);
    long operationCount = 0;

    bubbleSort(arr, n, &operationCount);

    printf("Sorted array: \n");
    printArray(arr, n);
    printf("Number of operations: %ld\n", operationCount);
    return 0;
}
